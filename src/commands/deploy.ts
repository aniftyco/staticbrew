import { BaseCommand } from '@adonisjs/ace';

export class DeployCommand extends BaseCommand {
  static commandName = 'deploy';
  static description = 'Deploy your static site to the cloud';

  async run() {}
}
