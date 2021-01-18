import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { CanvasWrapper } from '../../../util/wrappers';

export default class BlurCommand extends Command {
  public constructor() {
    super('blur', {
      aliases: ['blur'],
      category: 'image',
      description: {
        content: 'commands:image.blur',
        usage: 'blur [@user]',
        examples: ['blur @Katarina'],
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
      embed: new KatarinaEmbed(message.author).setImage('attachment://blur.png'),
      files: [
        {
          name: 'blur.png',
          attachment: await CanvasWrapper.blur(user.displayAvatarURL({ format: 'png', size: 1024 })),
        },
      ],
    });
  }
}
