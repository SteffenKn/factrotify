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

  private async getUserId() {
    const displayName = config.slack.username;

    // TODO: Add pagination
    const result = await this.app.client.users.list();

    if (!result.ok || !result.members) {
      throw new Error('Failed to fetch users');
    }

    const user = result.members.find((user) => user.real_name === displayName);

    if (!user?.id) {
      throw new Error(`User with display name "${displayName}" not found`);
    }

    return user.id;
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
}
