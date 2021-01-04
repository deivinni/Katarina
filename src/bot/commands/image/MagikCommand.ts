import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class MagikCommand extends Command {
  public constructor() {
    super('magik', {
      aliases: ['magik'],
      category: 'image',
      description: {
        content: 'commands:image.magik',
        usage: 'magik [@user]',
        examples: ['magik @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'phrase',
          default: (message: Message) => message.author,
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<Message> {
    const url = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('magik', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://magik.${format}`),
      files: [{ name: `magik.${format}`, attachment: image }],
    });
  }
}
