import config from '../../config/config.json';
import { FactroClient } from '../../clients';
import { NotificationService } from '../../notification-service';

export class FactroService {
  private factroClient: FactroClient;
  private notificationService: NotificationService;

  constructor(factroClient: FactroClient, notificationService: NotificationService) {
    this.factroClient = factroClient;
    this.notificationService = notificationService;
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

    const taskUrl = this.buildTaskUrl(task.mandantId, task.projectId, task.id);

    this.notificationService.notify(task.id, task.title, taskUrl);
  }

  private buildTaskUrl(mandantId: string, projectId: string, taskId: string) {
    const shortMandantId = mandantId.slice(0, 8);

    return `https://cloud.factro.com/${shortMandantId}/Project/${projectId}/psb?p=task&pi=${taskId}`;
  }
}
