import { BaseCommand, flags } from '@adonisjs/ace';

export class DevCommand extends BaseCommand {
  static commandName = 'dev';
  static description = 'Start the development server';
  static help = 'this is help';

  @flags.number({ description: 'Port to start the development server on', alias: 'p', default: 3333 })
  declare port: number;

  @flags.string({ description: 'Host to start the development server on', alias: 'H', default: 'localhost' })
  declare host: string;

  async run() {
    this.logger.log(`🚀 Starting server on ${this.colors.cyan(`http://${this.host}:${this.port}`)}...`);

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
