import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class ColorsCommand extends Command {
  public constructor() {
    super('colors', {
      aliases: ['colors'],
      category: 'image',
      description: {
        content: 'commands:image.colors',
        usage: 'colors [@user]',
        examples: ['colors @Katarina'],
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
    const url = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('colors', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://colors.${format}`),
      files: [{ name: `colors.${format}`, attachment: image }],
    });
  }
}
