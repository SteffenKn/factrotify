import express from 'express';

import { FactroService } from '../services/factro-service';

export class FactroController {
  private service: FactroService;

  constructor(service: FactroService) {
    this.service = service;
  }

  async handleTaskExecutorChanged(request: express.Request, response: express.Response) {
    console.log(`Received new task executor event: ${JSON.stringify(request.body)}`);

    const action = request.body.action;

    if (action !== 'TaskExecutorChanged') {
      response.sendStatus(400);

      console.error(`Received invalid event (expected action: TaskExecutorChanged, actual action: ${request.body.action})`);

      return;
    }

    const taskId = request.body.context.entityId;

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
