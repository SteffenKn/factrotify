import { App } from '@slack/bolt';
import config from '../config/config.json';

export class SlackClient {
  private app: App;

  private userId?: string;

  constructor() {
    this.app = new App({
      signingSecret: config.slack.signingSecret,
      token: config.slack.botToken,
    });
  }

  public async start() {
    await this.app.start(3001);

    this.userId = await this.getUserId();
  }

  public stop() {
    return this.app.stop();
  }

  public sendMessage(message: string) {
    if (!this.userId) {
      throw new Error(`User ID not set`);
    }

    return this.app.client.chat.postMessage({
      channel: this.userId,
      text: message,
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
