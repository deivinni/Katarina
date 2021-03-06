import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class DeepfryCommand extends Command {
  public constructor() {
    super('deepfry', {
      aliases: ['deepfry'],
      category: 'image',
      description: {
        content: 'commands:image.deepfry',
        usage: 'deepfry [@user]',
        examples: ['deepfry @Katarina'],
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
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const url = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('deepfry', { url });

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://deepfry.${format}`),
      files: [{ name: `deepfry.${format}`, attachment: image }],
    });
  }
}
