import {App} from '@slack/bolt';
import config from './config/config.json';

export default class SlackClient {

  private app: App;

  constructor() {
    this.app = new App({
      signingSecret: config.slack.signingSecret,
      token: config.slack.botToken,
    });
  }

  public start() {
    return this.app.start(3001);
  }

  public stop () {
    return this.app.stop();
  }

  public async getUserIdByDisplayName(displayName: string) {
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

  public sendMessage(userId: string, message: string) {
    return this.app.client.chat.postMessage({
      channel: userId,
      text: message,
    });
  }
}
