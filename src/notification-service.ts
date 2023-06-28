import { SlackClient } from './clients';

export class NotificationService {
  private slackClient: SlackClient;

  constructor(slackClient: SlackClient) {
    this.slackClient = slackClient;
  }

  public async notify(taskId: string, taskTitle: string, taskUrl: string) {
    const text = this.getExecutorChangedText(taskTitle);
    const message = this.getExecutorChangedMessage(taskId, taskTitle, taskUrl);

    console.log(`Sending message: "${text}"`);

    await this.slackClient.sendMessage(text, message);
  }

  private getExecutorChangedMessage(taskId: string, taskTitle: string, taskUrl: string) {
    return [
      {
        type: 'section',
        block_id: 'text-block',
        text: {
          type: 'mrkdwn',
          text: this.getExecutorChangedText(taskTitle, true),
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
            url: taskUrl,
            action_id: 'open-task',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Aufgabe abschließen',
            },
            value: taskId,
            action_id: 'finish-task',
          },
        ],
      },
    ];
  }

  private getExecutorChangedText(taskTitle: string, markdown = false) {
    const formattedTaskTitle = markdown ? `*${taskTitle}*` : taskTitle;

    return `Dir wurde eine neue Aufgabe zugewiesen: "${formattedTaskTitle}"`;
  }
}
