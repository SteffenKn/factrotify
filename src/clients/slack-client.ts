import { App, ExpressReceiver, Block, KnownBlock } from '@slack/bolt';

import config from '../config/config.json';

export class SlackClient {
  private app: App;
  private expressReceiver: ExpressReceiver;

  private userId?: string;

  constructor() {
    this.expressReceiver = new ExpressReceiver({
      signingSecret: config.slack.signingSecret,
      endpoints: {
        events: '/events',
      },
    });

    this.app = new App({
      receiver: this.expressReceiver,
      token: config.slack.botToken,
      signingSecret: config.slack.signingSecret,
    });
  }

  public async start() {
    await this.app.start();

    this.userId = await this.getUserId();
  }

  public stop() {
    return this.app.stop();
  }

  public getRouter() {
    return this.expressReceiver.router;
  }

  public getApp() {
    return this.app;
  }

  public sendMessage(message: string, blocks?: (Block | KnownBlock)[]) {
    if (!this.userId) {
      throw new Error(`User ID not set`);
    }

    if (!blocks) {
      return this.app.client.chat.postMessage({
        channel: this.userId,
        blocks: blocks,
      });
    }

    return this.app.client.chat.postMessage({
      channel: this.userId,
      text: message,
      blocks: blocks,
    });
  }

  private async getUserId() {
    const displayName = config.slack.username;

    let userId: string | undefined;
    let cursor: string | undefined;
    let done: boolean = false;

    while (!done) {
      const result = await this.getUsers(cursor);

      const user = result.members.find((user) => user.real_name === displayName);

      if (user?.id) {
        userId = user.id;
        done = true;
      } else {
        cursor = result.nextCursor;
        done = !cursor;
      }
    }

    if (!userId) {
      throw new Error(`User with display name "${displayName}" not found`);
    }

    return userId;
  }

  private async getUsers(cursor?: string) {
    const result = await this.app.client.users.list({
      cursor: cursor,
    });

    if (!result.ok || !result.members) {
      throw new Error('Failed to fetch users');
    }

    return {
      members: result.members,
      nextCursor: result.response_metadata?.next_cursor,
    };
  }
}
