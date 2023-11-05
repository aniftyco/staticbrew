import { BaseCommand, flags } from '@adonisjs/ace';

export class DevCommand extends BaseCommand {
  static commandName = 'dev';
  static description = 'Start the development server';

  @flags.number({ description: 'Port to start the development server on', alias: 'p' })
  public port: number = 3333;

  @flags.string({ description: 'Host to start the development server on', alias: 'H' })
  public host: string = 'localhost';

  async run() {
    this.logger.log(`🚀 Starting server on ${this.colors.cyan(`http://${this.host}:${this.port}`)}...`);

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
