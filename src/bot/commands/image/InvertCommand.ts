import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { CanvasWrappers } from '../../../util/wrappers';

export default class invertCommand extends Command {
  public constructor() {
    super('invert', {
      aliases: ['invert'],
      category: 'image',
      description: {
        content: 'commands:image.invert',
        usage: 'invert [@user]',
        examples: ['invert @Katarina'],
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
      embed: new KatarinaEmbed(message.author).setImage('attachment://invert.png'),
      files: [
        {
          name: 'invert.png',
          attachment: await CanvasWrappers.invert(user.displayAvatarURL({ format: 'png', size: 1024 })),
        },
      ],
    });
  }
}
