import express from 'express';
import bodyParser from 'body-parser';

export default class Webserver {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
  }

  public start() {
    return new Promise<void>((resolve) => {
      this.app.listen(3000, resolve);
    })
  }

  public addPostRoute(route: string, callback: (request: express.Request, response: express.Response) => any) {
    this.app.post(route, callback);
  }
}
