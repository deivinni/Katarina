import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class AsciiCommand extends Command {
  public constructor() {
    super('ascii', {
      aliases: ['ascii'],
      category: 'image',
      description: {
        content: 'commands:image.ascii',
        usage: 'ascii [@user]',
        examples: ['ascii @Katarina'],
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
    const url = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('ascii', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://ascii.${format}`),
      files: [{ name: `ascii.${format}`, attachment: image }],
    });
  }
}
