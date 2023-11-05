import { handleError, Kernel } from '@adonisjs/ace';
import { CommandConstructorContract, GlobalFlagHandler, ManifestCommand } from '@adonisjs/ace/build/src/Contracts';
import { printHelp, printHelpFor } from '@adonisjs/ace/build/src/utils/help';
import { Application } from '@adonisjs/application';
import { logger } from '@poppinss/cliui';

import * as commands from './commands';
import { getPkgJson } from './utils';

export class Console extends Kernel {
  public constructor(root: string) {
    super(new Application(root, 'console', {}));

    const help: GlobalFlagHandler = (value, _, command) => {
      if (!value) {
        return;
      }

      this.printHelp(command);
      process.exit(0);
    };

    this.flag('help', help, { alias: 'h' });

    this.register(Object.values(commands));
  }

  public printHelp(
    command?: CommandConstructorContract,
    commandsToAppend?: ManifestCommand[],
    aliasesToAppend?: Record<string, string>
  ) {
    const { description, version } = getPkgJson();
    let { commands, aliases } = (this as any).getAllCommandsAndAliases();

    if (commandsToAppend) {
      commands = commands.concat(commandsToAppend);
    }

    if (aliasesToAppend) {
      aliases = Object.assign({}, aliases, aliasesToAppend);
    }

    console.log(`${logger.colors.bold('StaticBrew')} - ${description} ${logger.colors.dim(`(v${version})`)}`);

    if (command) {
      printHelpFor({ ...command, commandName: `staticbrew ${command.commandName}` }, aliases);
    } else {
      console.log(`\n${logger.colors.yellow('Usage:')} staticbrew ${logger.colors.dim('<command>')}`);
      printHelp(commands, Object.values(this.flags), aliases);
    }
  }

  public async handle(argv: string[]) {
    return super.handle(argv).catch((error: unknown) => handleError(error));
  }
}
