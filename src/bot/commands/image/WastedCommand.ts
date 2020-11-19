import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class WastedCommand extends Command {
  public constructor() {
    super('wasted', {
      aliases: ['wasted'],
      category: 'image',
      description: {
        content: 'commands:wasted.description',
        usage: 'wasted [@user]',
        examples: ['wasted', 'wasted @Katarina'],
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
    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('wasted', { url: avatar });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://wasted.${format}`),
      files: [{ name: `wasted.${format}`, attachment: image }],
    });
  }
}
