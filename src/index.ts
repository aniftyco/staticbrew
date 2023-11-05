#!/usr/bin/env node --no-warnings

import { DeployCommand } from './deploy';
import { DevCommand } from './dev';
import { StaticBrew } from './staticbrew';

const cli = new StaticBrew(process.cwd());

cli.register([DevCommand, DeployCommand]);

cli.handle(process.argv.slice(2));
