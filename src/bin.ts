#!/usr/bin/env node --no-warnings
import { StaticBrew } from './index';

const cli = new StaticBrew(process.cwd());

cli.handle(process.argv.splice(2));
