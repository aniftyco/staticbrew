#!/usr/bin/env node --no-warnings

import { handleError, Kernel } from '@adonisjs/ace';
import { Application } from '@adonisjs/application';

import { DevCommand } from './dev';

const cli = new Kernel(new Application(process.cwd(), 'console', {}));

cli.register([DevCommand]);

cli.handle(process.argv.slice(2)).catch((error: unknown) => handleError(error));
