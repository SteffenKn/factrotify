import SlackClient from './slack-client';
import FactroClient from './factro-client';
import Webserver from './webserver';
import config from './config/config.json';

const slackClient = new SlackClient();
const factroClient = new FactroClient();
const webserver = new Webserver();

async function run() {
  webserver.addPostRoute('/factro/task-executor-changed', async (req, res) => {
    if (req.body.action !== 'TaskExecutorChanged') {
      res.sendStatus(400);
      return;
    }

    const taskId = req.body.context.entityId;
    const task = await factroClient.getTask(taskId);

    const { executorId, title } = task;

    const userIsNewExecutor = executorId === config.factro.employeeId;

    if (!userIsNewExecutor) {
      res.sendStatus(200);
    }

    const message = `You are now the executor of task: "${title}"`;
    await slackClient.sendMessage(userId, message);

    res.sendStatus(200);
  });

  await slackClient.start();

  const userId = await slackClient.getUserIdByDisplayName(config.slack.username);

  webserver.start();

  console.log('⚡️ App is running!');
}
run();
