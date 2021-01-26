import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { evaluate } from 'mathjs';

export default class MathCommand extends Command {
  public constructor() {
    super('math', {
      aliases: ['math', 'calc'],
      category: 'util',
      description: {
        content: 'commands:util.math.description',
        usage: 'math <calculation>',
        examples: ['math 2 + 2', 'math 2 * 2', 'calc 2 / 2'],
      },
      args: [
        {
          id: 'calc',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:util.math.arguments.start',
            retry: 'commands:util.math.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { calc }: { calc: string }): Promise<(void|Message)> {
    const replaces = {
      x: '*', '.': ',', ',': '.', '÷': '/',
    };

    try {
      const result = evaluate(calc.replace(/[x|,|.|÷]/gi, (char) => replaces[char]));

      return message.quote(this.client.i18n.t('commands:util.math.message', { result }));
    } catch (error) {
      this.client.logger.error(error);

      return message.quote(this.client.i18n.t('commands:util.math.unsuccessfully'));
    }
  }
}
