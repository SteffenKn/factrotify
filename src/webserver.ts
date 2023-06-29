import bodyParser from 'body-parser';
import express from 'express';
import { Container } from 'inversify';

import { IocDiscoveryTags } from './types';
import { BaseRouter } from './api/routes/base-router';

export class Webserver {
  private app: express.Application;

  constructor(container: Container) {
    this.app = express();

    // The slack client needs to be able to parse the request body by itself.
    // Therefore, we need to disable the body parser for the slack routes.
    this.app.use(/\/((?!slack).)*/, express.json());
    this.app.use(/\/((?!slack).)*/, bodyParser.urlencoded({ extended: true }));

    this.loadRouters(container);
  }

  public start() {
    return new Promise<void>((resolve) => {
      this.app.listen(3000, resolve);
    });
  }

  public addPostRoute(route: string, callback: (request: express.Request, response: express.Response) => any) {
    this.app.post(route, callback);
  }

  private loadRouters(container: Container) {
    const routers = container.getAll<BaseRouter>(IocDiscoveryTags.Router);

    routers.forEach((router) => {
      this.app.use(router.getRouter());
    });
  }
}
