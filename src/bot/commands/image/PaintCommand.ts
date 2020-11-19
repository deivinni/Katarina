import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class PaintCommand extends Command {
  public constructor() {
    super('paint', {
      aliases: ['paint'],
      category: 'image',
      description: {
        content: 'commands:paint.description',
        usage: 'paint [@user]',
        examples: ['paint @Katarina'],
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
    const { image, format } = await this.client.dagpi.image_process('paint', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://paint.${format}`),
      files: [{ name: `paint.${format}`, attachment: image }],
    });
  }
}
