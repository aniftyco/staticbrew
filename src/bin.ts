#!/usr/bin/env node --no-warnings

import { Console } from './console';

const cli = new Console(process.cwd());

cli.handle(process.argv.slice(2));
