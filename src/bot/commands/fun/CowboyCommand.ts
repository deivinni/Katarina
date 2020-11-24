import { Command } from 'discord-akairo';
import { Emoji, Message } from 'discord.js';

export default class CowboyCommand extends Command {
  public constructor() {
    super('cowboy', {
      aliases: ['cowboy'],
      category: 'fun',
      description: {
        content: 'commands:fun.cowboy.description',
        usage: 'cowboy <emoji>',
        examples: ['cowboy <:PepoHappy:619647854146879501>'],
      },
      args: [
        {
          id: 'emoji',
          type: 'emoji',
          match: 'phrase',
          prompt: {
            start: 'commands:cowboy.argsStart',
            retry: 'commands:cowboy.argsRetry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public exec(message: Message, { emoji }: { emoji: Emoji }): Promise<Message> {
    return message.util?.send(
      [
        '⠀ ⠀ ⠀  🤠',
        '　   000',
        '    0   0　0',
        '   👇   00 👇',
        '  　  0　0',
        '　   0　 0',
        '　    👢     👢',
      ].join('\n').replaceAll('0', emoji.toString()),
    );
  }
}
