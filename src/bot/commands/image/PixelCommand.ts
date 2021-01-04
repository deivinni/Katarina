import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { CanvasWrappers } from '../../../util/wrappers';

export default class PixelCommand extends Command {
  public constructor() {
    super('pixel', {
      aliases: ['pixel'],
      category: 'image',
      description: {
        content: 'commands:image.pixel',
        usage: 'pixel [@user]',
        examples: ['pixel', 'pixel @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          default: (message: Message) => message.author,
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<Message> {
    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage('attachment://pixel.png'),
      files: [
        {
          name: 'pixel.png',
          attachment: await CanvasWrappers.pixel(user.displayAvatarURL({ format: 'png', size: 1024 })),
        },
      ],
    });
  }
}
