#!/usr/bin/env node --no-warnings
import { Kernel, ListLoader } from '@adonisjs/ace';

import { DeployCommand } from './commands/deploy.js';
import { DevCommand } from './commands/dev.js';
import { HelpCommand } from './commands/help.js';
import { StaticBrew } from './commands/staticbrew.js';

const kernel = new Kernel(StaticBrew, Kernel.commandExecutor);

kernel.defineFlag(HelpCommand.commandName, {
  type: 'boolean',
  description: HelpCommand.description,
  alias: HelpCommand.aliases,
});

kernel.on('help', async (command, $kernel, parsed) => {
  if (command.commandName !== StaticBrew.commandName) {
    parsed.args.unshift(command.commandName);

    await new HelpCommand($kernel, parsed, kernel.ui, kernel.prompt).exec();
  } else {
    await new StaticBrew($kernel, parsed, kernel.ui, kernel.prompt).exec();
  }

  return $kernel.shortcircuit();
});

kernel.addLoader(new ListLoader([DevCommand, DeployCommand]));

kernel.handle(process.argv.slice(2)).catch(console.error);
