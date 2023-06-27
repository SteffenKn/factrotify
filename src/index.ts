import SlackClient from './slack-client';
import FactroClient from './factro-client';
import Webserver from './webserver';
import config from './config/config.json';

const slackClient = new SlackClient();
const factroClient = new FactroClient();
const webserver = new Webserver();

async function run() {
  webserver.addPostRoute('/factro/task-executor-changed', async (req, res) => {
    console.log(`Received new task executor event: ${JSON.stringify(req.body)}`);

    if (req.body.action !== 'TaskExecutorChanged') {
      res.sendStatus(400);

      console.error(`Received invalid event (expected action: TaskExecutorChanged, actual action: ${req.body.action})`);

      return;
    }

    const taskId = req.body.context.entityId;
    const task = await factroClient.getTask(taskId);

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

  await slackClient.start();

  const userId = await slackClient.getUserIdByDisplayName(config.slack.username);

  webserver.start();

  console.log('factrotify is running!');
}
run();
