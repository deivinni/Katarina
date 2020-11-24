import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class FiveGuysOneGirlCommand extends Command {
  public constructor() {
    super('5g1g', {
      aliases: ['5g1g', 'fiveguysonegirl'],
      category: 'image',
      description: {
        content: 'commands:image.5g1g.description',
        usage: '5g1g [@user]',
        examples: ['5g1g @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          prompt: {
            start: 'commands:image.5g1g.arguments.start',
            retry: 'commands:image.5g1g.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<Message> {
    const url = message.author.displayAvatarURL({ format: 'png', size: 1024 });
    const url2 = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('5g1g', { url, url2 });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://5g1g.${format}`),
      files: [{ name: `5g1g.${format}`, attachment: image }],
    });
  }
}
