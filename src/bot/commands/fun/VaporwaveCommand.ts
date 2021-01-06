import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class VaporwaveCommand extends Command {
  public constructor() {
    super('vaporwave', {
      aliases: ['vaporwave'],
      category: 'fun',
      description: {
        content: 'commands:fun.vaporwave.description',
        usage: 'vaporwave <message>',
        examples: ['vaporwave hello', 'vaporwave olá'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:fun.vaporwave.arguments.start',
            retry: 'commands:fun.vaporwave.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<void> {
    return message.quote(text.split('')
      .map((char) => {
        if (char === ' ') return '  ';

        const code = char.charCodeAt(0);
        return (code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char);
      })
      .join(''),
    );
  }
}
