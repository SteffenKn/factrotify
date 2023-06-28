import config from '../../config/config.json';
import { FactroClient, SlackClient } from '../../clients';
import { Task } from '../../types';

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

    const userIsNewExecutor = task.executorId === config.factro.employeeId;

    if (!userIsNewExecutor) {
      console.log(`User is not the new executor of task "${task.title}".`);

      return;
    }

    const message = this.getExecutorChangedMessage(task);
    const components = this.buildExecutorChangedComponents(task);

    console.log(`Sending message to user: "${message}"`);

    await this.slackClient.sendMessage(message, components);
  }

  private buildTaskUrl(mandantId: string, projectId: string, taskId: string) {
    const shortMandantId = mandantId.slice(0, 8);

    return `https://cloud.factro.com/${shortMandantId}/Project/${projectId}/psb?p=task&pi=${taskId}`;
  }

  private buildExecutorChangedComponents(task: Task) {
    return [
      {
        type: 'section',
        block_id: 'text-block',
        text: {
          type: 'mrkdwn',
          text: this.getExecutorChangedMessage(task, true),
        },
      },
      {
        type: 'actions',
        block_id: 'button-row-block',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Aufgabe öffnen',
            },
            style: 'primary',
            url: this.buildTaskUrl(task.mandantId, task.projectId, task.id),
            action_id: 'open-task',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Aufgabe abschließen',
            },
            value: task.id,
            action_id: 'finish-task',
          },
        ],
      },
    ];
  }

  private getExecutorChangedMessage(task: Task, markdown = false) {
    const taskTitle = markdown ? `*${task.title}*` : task.title;

    return `Dir wurde eine neue Aufgabe zugewiesen: "${taskTitle}"`;
  }
}
