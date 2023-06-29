import { injectable, inject } from 'inversify';

import { FactroClient } from '../../clients';
import { IocIds } from '../../types';

@injectable()
export class SlackService {
  private factroClient: FactroClient;

  constructor(@inject(IocIds.FactroClient) factroClient: FactroClient) {
    this.factroClient = factroClient;
  }

  public handleFinishTask(taskId: string) {
    return this.factroClient.finishTask(taskId);
  }
}
