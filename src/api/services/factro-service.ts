import config from '../../config/config.json';

import { FactroClient, SlackClient } from '../../clients';

export class FactroService {
  private factroClient: FactroClient;
  private slackClient: SlackClient;

  constructor(factroClient: FactroClient, slackClient: SlackClient) {
    this.factroClient = factroClient;
    this.slackClient = slackClient;
  }

  public async handleTaskExecutorChanged(taskId: string) {
    let task;
    try {
      task = await this.factroClient.getTask(taskId);
    } catch (error) {
      if (error.cause) {
        throw error.cause;
      }

      console.error(error);
      return;
    }

    const { executorId, title } = task;

    const userIsNewExecutor = executorId === config.factro.employeeId;

    if (!userIsNewExecutor) {
      console.log(`User is not the new executor of task "${title}".`);

      return;
    }

    const message = `You are now the executor of task: "${title}"`;

    console.log(`Sending message to user: "${message}"`);

    await this.slackClient.sendMessage(message);
  }
}
