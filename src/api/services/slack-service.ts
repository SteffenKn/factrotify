import { FactroClient } from '../../clients';

export class SlackService {
  private factroClient: FactroClient;

  constructor(factroClient: FactroClient) {
    this.factroClient = factroClient;
  }

  public handleFinishTask(taskId: string) {
    return this.factroClient.finishTask(taskId);
  }
}
