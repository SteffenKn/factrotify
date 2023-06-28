import { BaseRouter } from './base-router';

import { SlackController } from '../controller';

import { SlackClient } from './../../clients/slack-client';

export class SlackRouter extends BaseRouter {
  private controller: SlackController;
  private slackClient: SlackClient;

  constructor(controller: SlackController, slackClient: SlackClient) {
    super('/slack', slackClient.getRouter());

    this.controller = controller;
    this.slackClient = slackClient;

    this.initializeRoutes();
  }

  protected initializeRoutes() {
    const slackApp = this.slackClient.getApp();

    slackApp.action('finish-task', this.controller.handleFinishTask.bind(this.controller));
    slackApp.action('open-task', this.controller.handleOpenTask.bind(this.controller));
  }
}
