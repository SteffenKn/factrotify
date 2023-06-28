import express from 'express';

export abstract class BaseRouter {
  protected router: express.Router;

  constructor(basePath?: string, router?: express.Router) {
    this.router = router ? router : express.Router();

    if (basePath) {
      this.router.use(basePath, this.router);
    }
  }

  public getRouter() {
    return this.router;
  }

  protected abstract initializeRoutes(): void;
}
