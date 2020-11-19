import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class WhyAreYouGayCommand extends Command {
  public constructor() {
    super('whyareyougay', {
      aliases: ['whyareyougay'],
      category: 'image',
      description: {
        content: 'commands:whyareyougay.description',
        usage: 'whyareyougay <@user>',
        examples: ['whyareyougay @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          prompt: {
            start: 'commands:whyareyougay.arguments.start',
            retry: 'commands:whyareyougay.arguments.retry',
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
    const { image, format } = await this.client.dagpi.image_process('whyareyougay', { url, url2 });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://whyareyougay.${format}`),
      files: [{ name: `whyareyougay.${format}`, attachment: image }],
    });
  }
}
