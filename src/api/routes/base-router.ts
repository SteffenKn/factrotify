import express from 'express';
import { injectable, unmanaged as _unmanaged } from 'inversify';
import { DecoratorTarget } from 'inversify/lib/annotation/decorator_utils';

// TODO: Remove after https://github.com/inversify/InversifyJS/issues/1505 is resolved
const unmanaged = _unmanaged as () => (target: DecoratorTarget, targetKey: string | undefined, index: number) => void;

@injectable()
export abstract class BaseRouter {
  protected router: express.Router;

  constructor(@unmanaged() basePath?: string, router?: express.Router) {
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
