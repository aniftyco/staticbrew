import { args, BaseCommand } from '@adonisjs/ace';
import { TERMINAL_SIZE, wrap } from '@poppinss/cliui/helpers';

import {
  formatArgumentDescription,
  formatArgumentOption,
  formatCommandDescription,
  formatFlagDescription,
  formatFlagOption,
  formatHelp,
  formatTables,
  formatUsage,
  renderErrorWithSuggestions,
} from '../uitls.js';

export class HelpCommand extends BaseCommand {
  static commandName = 'help';
  static description = 'View help for a given command';
  static $helpFlag = {
    type: 'boolean',
    name: HelpCommand.commandName,
    flagName: HelpCommand.commandName,
    description: HelpCommand.description,
    alias: HelpCommand.aliases,
  };

  @args.string({ description: 'Command name', argumentName: 'command' })
  declare name: string;

  private validateCommandName() {
    const command = this.kernel.getCommand(this.name);
    if (!command) {
      renderErrorWithSuggestions(
        this.ui,
        `Command "${this.name}" is not defined`,
        this.kernel.getCommandSuggestions(this.name)
      );
      return false;
    }

    return true;
  }

  private makeArgumentsTable(heading: string, command: any) {
    if (!command.args.length) {
      return [];
    }

    return [
      {
        heading: this.colors.yellow(heading),
        columns: command.args.map((arg) => {
          return {
            option: formatArgumentOption(arg, this.colors),
            description: formatArgumentDescription(arg, this.colors),
          };
        }),
      },
    ];
  }

  private makeOptionsTable(heading: string, command: any) {
    const flags = command.flags.concat(HelpCommand.$helpFlag);

    return [
      {
        heading: this.colors.yellow(heading),
        columns: flags.map((flag) => {
          return {
            option: formatFlagOption(flag, this.colors),
            description: formatFlagDescription(flag, this.colors),
          };
        }),
      },
    ];
  }

  private renderDescription(command: any) {
    const description = formatCommandDescription(command, this.colors);

    if (!description) {
      return;
    }

    this.logger.log('');
    this.logger.log(this.colors.yellow('Description:'));
    this.logger.log(
      wrap([description], {
        startColumn: 2,
        trimStart: false,
        endColumn: TERMINAL_SIZE,
      }).join('\n')
    );
  }

  private renderUsage(command: any) {
    const aliases = this.kernel.getCommandAliases(command.commandName);
    const usage = formatUsage(command, aliases, this.colors, this.kernel.info.get('binary') as any).join('\n');

    this.logger.log('');
    this.logger.log(this.colors.yellow('Usage:'));
    this.logger.log(usage);
  }

  private renderList(command: any) {
    const tables = this.makeArgumentsTable('Arguments:', command).concat(this.makeOptionsTable('Options:', command));

    formatTables(tables).forEach((table) => {
      this.logger.log('');
      this.logger.log(table.heading);
      this.logger.log(table.rows.join('\n'));
    });
  }

  private renderHelp(command: any) {
    const help = formatHelp(command, this.kernel.info.get('binary') as string);
    if (!help) {
      return;
    }

    this.logger.log('');
    this.logger.log(this.colors.yellow('Help:'));
    this.logger.log(help);
  }

  async run() {
    const isValidCommand = this.validateCommandName();
    if (!isValidCommand) {
      this.exitCode = 1;
      return;
    }

    const command = this.kernel.getCommand(this.name)!;
    this.logger.log(`StaticBrew CLI ${this.colors.dim('v0.0.0')}`);
    this.renderDescription(command);
    this.renderUsage(command);
    this.renderList(command);
    this.renderHelp(command);
  }
}
