import express from 'express';
import { injectable, inject } from 'inversify';

import { FactroService } from '../services';
import { IocIds } from '../../types/index';

@injectable()
export class FactroController {
  private service: FactroService;

  constructor(@inject(IocIds.FactroService) service: FactroService) {
    this.service = service;
  }

  async handleTaskExecutorChanged(request: express.Request, response: express.Response) {
    const action = request.body.action;
    const taskId = request.body.context?.entityId;

    if (!action || !taskId) {
      response.sendStatus(400);

      console.error(`Received invalid event (missing action or context.entityId). Body: ${JSON.stringify(request.body)}`);
      return;
    }

    if (action !== 'TaskExecutorChanged') {
      response.sendStatus(400);

      console.error(`Received invalid event (expected action: "TaskExecutorChanged", actual action: "${request.body.action}")`);
      return;
    }

    console.log(`Received new task executor changed event (taskId: "${taskId}")`);

    try {
      await this.service.handleTaskExecutorChanged(taskId);
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
      return;
    }

    response.sendStatus(200);
  }
}
