import { handleError, Kernel } from '@adonisjs/ace';
import { Application } from '@adonisjs/application';

import { DevCommand } from './dev';

export class StaticBrew {
  private app: Application;
  private ace: Kernel;

  constructor(root: string) {
    this.app = new Application(root, 'console', {});
    this.ace = new Kernel(this.app);

    this.ace.register([DevCommand]);
  }

  public async handle(argv: string[]) {
    return this.ace.handle(argv).catch((error: unknown) => handleError(error));
  }
}
