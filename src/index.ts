import { SlackClient, FactroClient } from './clients';
import Webserver from './webserver';

import { FactroController } from './api/controller';
import { FactroService } from './api/services';
import { FactroRouter } from './api/routes';

const slackClient = new SlackClient();
const factroClient = new FactroClient();
const webserver = new Webserver();

const factroService = new FactroService(factroClient, slackClient);
const factroController = new FactroController(factroService);
const factroRouter = new FactroRouter(factroController);

async function run() {
  try {
    await slackClient.start();
  } catch (error) {
    console.error('Failed to start Slack client. Please check your config: ', error);

    process.exit(1);
  }

  webserver.addRouter(factroRouter.getRouter());

  await webserver.start();

  console.log('factrotify is running!');
}
run();
