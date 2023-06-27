import { BaseRouter } from './base-router';

import { FactroController } from '../controller/index';

export class FactroRouter extends BaseRouter {
  private controller: FactroController;

  constructor(controller: FactroController) {
    super('/factro');

    this.controller = controller;

    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post('/task-executor-changed', this.controller.handleTaskExecutorChanged.bind(this.controller));
  }
}
