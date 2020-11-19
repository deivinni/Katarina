import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class GayCommand extends Command {
  public constructor() {
    super('gay', {
      aliases: ['gay'],
      category: 'image',
      description: {
        content: 'commands:gay.description',
        usage: 'gay [@user]',
        examples: ['gay @Katarina'],
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
    const url = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('gay', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://gay.${format}`),
      files: [{ name: `gay.${format}`, attachment: image }],
    });
  }
}
