import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class WhyAreYouGayCommand extends Command {
  public constructor() {
    super('whyareyougay', {
      aliases: ['whyareyougay'],
      category: 'image',
      description: {
        content: 'commands:image.whyareyougay.description',
        usage: 'whyareyougay <@user>',
        examples: ['whyareyougay @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          prompt: {
            start: 'commands:image.whyareyougay.arguments.start',
            retry: 'commands:image.whyareyougay.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const url = message.author.displayAvatarURL({ format: 'png', size: 1024 });
    const url2 = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('whyareyougay', { url, url2 });

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://whyareyougay.${format}`),
      files: [{ name: `whyareyougay.${format}`, attachment: image }],
    });
  }
}
