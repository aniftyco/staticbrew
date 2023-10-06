import stringWidth from 'string-width';

import { justify, TERMINAL_SIZE, wrap } from '@poppinss/cliui/helpers';
import string from '@poppinss/utils/string';

export const formatCommandName = (command: any, aliases: string[], colors: any) => {
  const formattedAliases = aliases.length ? ` ${colors.dim(`(${aliases.join(', ')})`)}` : '';

  return `  ${colors.green(command.commandName)}${formattedAliases}  `;
};

export const formatCommandDescription = (command: any, colors: any) => {
  if (!command.description) {
    return '';
  }

  return colors.dim(command.description);
};

export const formatValueFlag = (flag: any, valuePlaceholder: string) => {
  return flag.required ? `=${valuePlaceholder}` : `[=${valuePlaceholder}]`;
};

export const formatAliases = (flag: any) => {
  if (!flag.alias) {
    return [];
  }

  if (typeof flag.alias === 'string') {
    return [`-${flag.alias}`];
  }

  return flag.alias.map((alias) => `-${alias}`);
};

export const formatFlagOption = (flag: any, colors: any) => {
  switch (flag.type) {
    case 'array': {
      const value = formatValueFlag(flag, `${flag.flagName.toUpperCase()}...`);
      const aliases = formatAliases(flag);
      const flagWithValue = `--${flag.flagName}${value}`;

      if (aliases.length) {
        return `  ${colors.green(`${aliases.join(',')}, ${flagWithValue}`)}  `;
      }

      return `  ${colors.green(flagWithValue)}  `;
    }
    case 'string': {
      const value = formatValueFlag(flag, `${flag.flagName.toUpperCase()}`);
      const aliases = formatAliases(flag);
      const flagWithValue = `--${flag.flagName}${value}`;

      if (aliases.length) {
        return `  ${colors.green(`${aliases.join(',')}, ${flagWithValue}`)}  `;
      }

      return `  ${colors.green(flagWithValue)}  `;
    }
    case 'number': {
      const value = formatValueFlag(flag, `${flag.flagName.toUpperCase()}`);
      const aliases = formatAliases(flag);
      const flagWithValue = `--${flag.flagName}${value}`;

      if (aliases.length) {
        return `  ${colors.green(`${aliases.join(',')}, ${flagWithValue}`)}  `;
      }

      return `  ${colors.green(flagWithValue)}  `;
    }
    case 'boolean': {
      const aliases = formatAliases(flag);
      const negatedVariant = flag.showNegatedVariantInHelp ? `|--no-${flag.flagName}` : '';
      const flagWithVariant = `--${flag.flagName}${negatedVariant}`;

      if (aliases.length) {
        return `  ${colors.green(`${aliases.join(',')}, ${flagWithVariant}`)}  `;
      }

      return `  ${colors.green(flagWithVariant)}  `;
    }
  }
};

export const formatFlagDescription = (flag: any, colors: any) => {
  const defaultValue = flag.default !== undefined ? `[default: ${flag.default}]` : '';
  const separator = defaultValue && flag.description ? ' ' : '';
  return colors.dim(`${flag.description || ''}${separator}${defaultValue}`);
};

export const getLargestOptionColumnWidth = (tables: any[]) => {
  return Math.max(...tables.map((table) => table.columns.map((column) => stringWidth(column.option))).flat());
};

export const formatRows = (table: any, largestOptionColumnWidth: number, terminalWidth: number) => {
  const options = justify(
    table.columns.map(({ option }) => option),
    { maxWidth: largestOptionColumnWidth }
  );

  const descriptions = wrap(
    table.columns.map(({ description }) => description),
    {
      startColumn: largestOptionColumnWidth,
      endColumn: terminalWidth,
      trimStart: true,
    }
  );

  return table.columns.map((_, index) => `${options[index]}${descriptions[index]}`);
};

export const formatTables = (tables: any[], terminalWidth: number = TERMINAL_SIZE) => {
  const largestOptionColumnWidth = getLargestOptionColumnWidth(tables);

  return tables.map((table) => {
    return {
      heading: table.heading,
      rows: formatRows(table, largestOptionColumnWidth, terminalWidth),
    };
  });
};

export const renderErrorWithSuggestions = (ui: any, message: string, suggestions: string[]) => {
  const instructions = ui
    .sticker()
    .fullScreen()
    .drawBorder((borderChar, colors) => colors.red(borderChar));

  instructions.add(ui.colors.red(message));
  if (suggestions.length) {
    instructions.add('');
    instructions.add(`${ui.colors.dim('Did you mean?')} ${suggestions.slice(0, 4).join(', ')}`);
  }

  instructions.getRenderer().logError(instructions.prepare());
};

export const formatArgument = (argument: any, placeholder: string) => {
  return argument.required ? `${placeholder}` : `[${placeholder}]`;
};

export const formatArgumentOption = (argument: any, colors: any) => {
  switch (argument.type) {
    case 'spread':
      return colors.dim(`${formatArgument(argument, `<${argument.argumentName}...>`)}`);
    case 'string':
      return colors.dim(`${formatArgument(argument, `<${argument.argumentName}>`)}`);
  }
};

export const formatArgumentDescription = (argument: any, colors: any) => {
  const defaultValue = argument.default ? `[default: ${argument.default}]` : '';
  const separator = defaultValue && argument.description ? ' ' : '';
  return colors.dim(`${argument.description || ''}${separator}${defaultValue}`);
};

export const formatUsage = (command: any, aliases: string[], colors: any, binaryName: string) => {
  const binary = binaryName ? `${binaryName} ` : '';
  const flags = command.flags.length ? colors.dim('[options]') : '';
  const args = command.args.map((arg) => formatArgumentOption(arg, colors)).join(' ');
  const separator = flags && args ? ` ${colors.dim('[--]')} ` : '';

  const mainUsage = [`  ${binary}${command.commandName} ${flags}${separator}${args}`];
  return mainUsage.concat(aliases.map((alias) => `  ${binary}${alias} ${flags}${separator}${args}`));
};

export const formatHelp = (command: any, binaryName: string, terminalWidth: number = TERMINAL_SIZE) => {
  const binary = binaryName ? `${binaryName}` : '';
  if (!command.help) {
    return '';
  }

  const help = Array.isArray(command.help) ? command.help : [command.help];

  return wrap(
    help.map((line) => string.interpolate(line, { binaryName: binary })),
    {
      startColumn: 2,
      trimStart: false,
      endColumn: terminalWidth,
    }
  ).join('\n');
};
