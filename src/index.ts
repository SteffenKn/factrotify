import SlackClient from './slack-client';
import FactroClient from './factro-client';
import Webserver from './webserver';
import config from './config/config.json';

const slackClient = new SlackClient();
const factroClient = new FactroClient();
const webserver = new Webserver();

async function run() {
  let userId: string;
  try {
    await slackClient.start();

    userId = await slackClient.getUserIdByDisplayName(config.slack.username);
  } catch (error) {
    console.error('Failed to start Slack client. Please check your config: ', error);

    return;
  }

  webserver.addPostRoute('/factro/task-executor-changed', async (req, res) => {
    console.log(`Received new task executor event: ${JSON.stringify(req.body)}`);

    if (req.body.action !== 'TaskExecutorChanged') {
      res.sendStatus(400);

      console.error(`Received invalid event (expected action: TaskExecutorChanged, actual action: ${req.body.action})`);

      return;
    }

    const taskId = req.body.context.entityId;

    let task;
    try {
      task = await factroClient.getTask(taskId);
    } catch (error) {
      if (error.cause) {
        throw error.cause;
      }

      console.error(error);
      return;
    }

    const { executorId, title } = task;

    const userIsNewExecutor = executorId === config.factro.employeeId;

    if (!userIsNewExecutor) {
      res.sendStatus(200);

      console.log(`User is not the new executor of task "${title}".`);

      return;
    }

    const message = `You are now the executor of task: "${title}"`;

    console.log(`Sending message to user: "${message}"`);

    await slackClient.sendMessage(userId, message);

    res.sendStatus(200);
  });

  await webserver.start();

  console.log('factrotify is running!');
}
run();
