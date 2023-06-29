import 'reflect-metadata';
import { Container } from 'inversify';

import { registerModulesInContainer } from './ioc-module';
import { Webserver } from './webserver';
import { SlackClient } from './clients';

import { IocIds } from './types';

const container = new Container();
registerModulesInContainer(container);

const webserver = new Webserver(container);
const slackClient = container.get<SlackClient>(IocIds.SlackClient);

async function run() {
  try {
    await slackClient.start();
  } catch (error) {
    console.error('Failed to start Slack client. Please check your config: ', error);

    process.exit(1);
  }
  await webserver.start();

  console.log('factrotify is running');
}
run();
