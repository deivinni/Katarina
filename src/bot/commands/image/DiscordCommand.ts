import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class DiscordCommand extends Command {
  public constructor() {
    super('discord', {
      aliases: ['discord'],
      category: 'image',
      description: {
        content: 'commands:discord.description',
        usage: 'discord [@user]',
        examples: ['discord @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'phrase',
          prompt: {
            start: 'commands:discord.arguments.userStart',
            retry: 'commands:discord.arguments.userRetry',
          },
        }, {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:discord.arguments.textStart',
            retry: 'commands:discord.arguments.textRetry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user, text }: { user: User, text: string }): Promise<Message> {
    const url = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('discord', {
      url,
      text,
      username: user.username,
    });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://discord.${format}`),
      files: [{ name: `discord.${format}`, attachment: image }],
    });
  }
}
