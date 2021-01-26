import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import axios from 'axios';

export default class ShortURLCommand extends Command {
  public constructor() {
    super('shorturl', {
      aliases: ['shorturl', 'encurtar'],
      category: 'util',
      description: {
        content: 'commands:util.surl.description',
        usage: 'shorturl <text>',
        examples: ['shorturl https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      },
      args: [
        {
          id: 'url',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:util.surl.arguments.start',
            retry: 'commands.util.surl.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { url }: { url: string }): Promise<(void|Message)> {
    const { data } = await axios.get('https://is.gd/create.php', {
      params: {
        format: 'simple',
        url: url.replace(/<|>/g, ''),
      },
    });

    if (data === 'Error: Please enter a valid URL to shorten') {
      return message.quote(this.client.i18n.t('commands:util.shorturl.unsuccessfully'));
    }

    return message.quote(this.client.i18n.t('commands:util.shorturl.message', { data }));
  }
}
