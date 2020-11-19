import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class JailCommand extends Command {
  public constructor() {
    super('jail', {
      aliases: ['jail'],
      category: 'image',
      description: {
        content: 'commands:jail.description',
        usage: 'jail [@user]',
        examples: ['jail @Katarina'],
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
    const { image, format } = await this.client.dagpi.image_process('jail', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://jail.${format}`),
      files: [{ name: `jail.${format}`, attachment: image }],
    });
  }
}
