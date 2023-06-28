import { NotificationService } from './notification-service';
import { Webserver } from './webserver';
import { SlackClient, FactroClient } from './clients';

import { FactroController, SlackController } from './api/controller';
import { FactroService, SlackService } from './api/services';
import { FactroRouter, SlackRouter } from './api/routes';

const slackClient = new SlackClient();
const factroClient = new FactroClient();

const webserver = new Webserver();
const notificationService = new NotificationService(slackClient);

const factroService = new FactroService(factroClient, notificationService);
const factroController = new FactroController(factroService);
const factroRouter = new FactroRouter(factroController);

const slackService = new SlackService(factroClient);
const slackController = new SlackController(slackService);
const slackRouter = new SlackRouter(slackController, slackClient);

async function run() {
  webserver.addRouter(factroRouter.getRouter());
  webserver.addRouter(slackRouter.getRouter());

  try {
    await slackClient.start();
  } catch (error) {
    console.error('Failed to start Slack client. Please check your config: ', error);

    process.exit(1);
  }

  await webserver.start();

  console.log('factrotify is running!');
}
run();
