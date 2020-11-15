import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

export class Logger {
  public log(content: unknown, { color = 'grey', tag = 'Log' } = {}): void {
    this.write(content, { color, tag });
  }

  public info(content: unknown, { color = 'green', tag = 'Info' } = {}): void {
    this.write(content, { color, tag });
  }

  public warn(content: unknown, { color = 'yellow', tag = 'Warn' } = {}): void {
    this.write(content, { color, tag });
  }

  public error(content: unknown, { color = 'red', tag = 'Error' } = {}): void {
    this.write(content, { color, tag, error: true });
  }

  public stacktrace(content: unknown, { color = 'white', tag = 'Error' } = {}): void {
    this.write(content, { color, tag, error: true });
  }

  public write(content: unknown, { color = 'grey', tag = 'Log', error = false } = {}): void {
    const timestamp = chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`);
    const levelTag = chalk.bold(`[${tag}]:`);
    const text = chalk[color](this.clean(content));
    const stream = error ? process.stderr : process.stdout;
    stream.write(`${timestamp} ${levelTag} ${text}\n`);
  }

  // eslint-disable-next-line class-methods-use-this
  public clean(item: unknown): string {
    if (typeof item === 'string') return item;
    const cleaned = util.inspect(item, { depth: Infinity });
    return cleaned;
  }
}
