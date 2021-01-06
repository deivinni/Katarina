import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';

import axios from 'axios';

import { KatarinaEmbed, shortenerText } from '../../../util/functions';

export default class MemeCommand extends Command {
  public constructor() {
    super('meme', {
      aliases: ['meme', 'ifunny'],
      category: 'fun',
      description: {
        content: 'commands:fun.meme.description',
        usage: 'meme',
        examples: ['meme'],
      },
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message): Promise<void> {
    const { data } = await axios.get('https://api.hyperfects.com/ifunny/');
    const meme = data[Math.floor(Math.random() * data.length)];

    let embed = meme.url;
    if (['jpg', 'gif'].includes(meme.type)) {
      embed = new KatarinaEmbed(message.author)
        .setDescription([
          `${
            meme.tags.length > 0
              ? `\`${
                shortenerText(Util.escapeInlineCode(meme.tags), 100).trim().replace(/[\n|,|`]/g, '`, `').trim()}\`\n`
              : ''
          }`,
          `[__**${this.client.i18n.t('commands:fun.meme.embed')}**__](${meme.url})`,
        ])
        .setImage(meme.src);
    }

    return message.quote(embed);
  }
}
