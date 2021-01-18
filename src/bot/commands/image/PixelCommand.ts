import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { CanvasWrapper } from '../../../util/wrappers';

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

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage('attachment://pixel.png'),
      files: [
        {
          name: 'pixel.png',
          attachment: await CanvasWrapper.pixel(user.displayAvatarURL({ format: 'png', size: 1024 })),
        },
      ],
    });
  }
}
