import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

const specialCodes = {
  0: ':zero:',
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:',
  9: ':nine:',
  '#': ':hash:',
  '*': ':asterisk:',
  '?': ':grey_question:',
  '!': ':grey_exclamation:',
  ' ': '   ',
};

export default class EmojifyCommand extends Command {
  public constructor() {
    super('emojify', {
      aliases: ['emojify'],
      category: 'fun',
      description: {
        content: 'commands:fun.emojify.description',
        usage: 'emojify <message>',
        examples: ['emojify hello', 'emojify olá'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:fun.emojify.arguments.start',
            retry: 'commands:fun.emojify.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<void> {
    const emoji = text.toLowerCase().split('').map((letter) => {
      if (specialCodes[letter]) return `${specialCodes[letter]} `;

      return `:regional_indicator_${letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}: `;
    }).join('');

    return message.quote(emoji);
  }
}
