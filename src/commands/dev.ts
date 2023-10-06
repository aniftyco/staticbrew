import { args, BaseCommand } from '@adonisjs/ace';

export class DevCommand extends BaseCommand {
  static commandName = 'dev';
  static description = 'Start the development server';
  static help = 'this is help';

  @args.string({ description: 'Command name', argumentName: 'command' })
  declare name: string;

  async run() {}
}
