import { BaseCommand, HelpCommand } from '@adonisjs/ace';

import {
  formatCommandDescription,
  formatCommandName,
  formatFlagDescription,
  formatFlagOption,
  formatTables,
} from '../uitls.js';

export class StaticBrew extends BaseCommand {
  static commandName = 'staticbrew';

  private makeOptionsTable(heading: string, flags: any[]) {
    return {
      heading: this.colors.yellow(heading),
      columns: flags.map((flag) => {
        return {
          option: formatFlagOption(flag, this.colors),
          description: formatFlagDescription(flag, this.colors),
        };
      }),
    };
  }

  private getOptionsTable() {
    if (!this.kernel.flags.length) {
      return [];
    }

    return [this.makeOptionsTable('Options:', this.kernel.flags)];
  }

  private makeCommandsTable(heading: string, commands: any) {
    return {
      heading: this.colors.yellow(heading),
      columns: commands
        .filter((command) => ![HelpCommand.commandName, this.commandName].includes(command.commandName))
        .map((command) => {
          const aliases = this.kernel.getCommandAliases(command.commandName);
          return {
            option: formatCommandName(command, aliases, this.colors),
            description: formatCommandDescription(command, this.colors),
          };
        }),
    };
  }

  private getCommandsTable() {
    return [
      this.makeCommandsTable('Available commands:', this.kernel.getNamespaceCommands()),
      ...this.kernel
        .getNamespaces()
        .map((namespace) => this.makeCommandsTable(namespace, this.kernel.getNamespaceCommands(namespace))),
    ];
  }

  async run() {
    const tables = this.getOptionsTable().concat(this.getCommandsTable());

    this.logger.log(
      `${this.colors.bold('StaticBrew')} - where your static sites live ${this.colors.dim('(v0.0.0)')}\n`
    );
    this.logger.log(this.colors.yellow('Usage:'));
    this.logger.log(`  staticbrew  ${this.colors.dim('<command> [options]')}`);

    formatTables(tables).forEach((table) => {
      this.logger.log('');
      this.logger.log(table.heading);
      this.logger.log(table.rows.join('\n'));
    });
  }
}
