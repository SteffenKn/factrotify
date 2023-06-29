import { IocIds } from '../../types/ioc-ids';
import { injectable, inject } from 'inversify';

import { BaseRouter } from './base-router';

import { FactroController } from '../controller';

import config from '../../config/config.json';

@injectable()
export class FactroRouter extends BaseRouter {
  private controller: FactroController;

  constructor(@inject(IocIds.FactroController) controller: FactroController) {
    super('/factro');

    this.controller = controller;

    this.initializeAuthMiddleware();
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post('/task-executor-changed', this.controller.handleTaskExecutorChanged.bind(this.controller));
  }

  private initializeAuthMiddleware() {
    const expectedAuthKey = config.factro.webhookAuthKey;

    if (!expectedAuthKey) {
      return;
    }

    this.router.use((request, response, next) => {
      const authKey = request.headers.authorization;

      if (authKey !== expectedAuthKey) {
        response.sendStatus(401);

        console.error('Invalid factro request: Invalid authorization key.');

        return;
      }

      next();
    });
  }
}
