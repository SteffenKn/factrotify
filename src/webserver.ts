import express from 'express';
import bodyParser from 'body-parser';

export class Webserver {
  private app: express.Application;

  constructor() {
    this.app = express();

    // The slack client needs to be able to parse the request body by itself.
    // Therefore, we need to disable the body parser for the slack routes.
    this.app.use(/\/((?!slack).)*/, express.json());
    this.app.use(/\/((?!slack).)*/, bodyParser.urlencoded({ extended: true }));
  }

  public start() {
    return new Promise<void>((resolve) => {
      this.app.listen(3000, resolve);
    });
  }

  public addRouter(router: express.Router) {
    this.app.use(router);
  }

  public addPostRoute(route: string, callback: (request: express.Request, response: express.Response) => any) {
    this.app.post(route, callback);
  }
}
