import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import MalScraper from 'mal-scraper';

import { KatarinaEmbed } from '../../../util/functions';
import { Translate } from '../../../util/wrappers';

export default class MyAnimeListCommand extends Command {
  public constructor() {
    super('myanimelist', {
      aliases: ['myanimelist', 'mal', 'anime'],
      category: 'search',
      description: {
        content: 'commands:search.myanimelist.description',
        usage: 'myanimelist <anime>',
        example: ['myanimelist demon slayer', 'myanimelist konosuba'],
      },
      args: [{
        id: 'anime',
        type: 'string',
        match: 'rest',
        prompt: {
          start: 'digite o nome do anime que deseja pesquisar',
          retry: 'você não digitou o nome do anime',
        },
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { anime }: { anime: string }): Promise<void> {
    const { t } = this.client.i18n;
    const data = await MalScraper.getInfoFromName(anime);
    const transDescription = await Translate(data.synopsis.split('\n\n')[0], { to: 'pt', from: 'en' });
    const transGenero = await Translate(data.genres.join(', '), { to: 'pt', from: 'en' });

    const embed = new KatarinaEmbed(message.author)
      .setTitleURL(`${data.title} ${data.japaneseTitle ? `(${data.japaneseTitle})` : ''}`, data.url)
      .setTimeFooter(`MyAnimeList ID: ${data.id}`);

    if (transDescription) embed.setDescription(transDescription.translated);
    if (data.picture) embed.setThumbnail(data.picture);

    for (const property of ['aired', 'rating', 'genres', 'episodes', 'score', 'status']) {
      if (property === 'genres' && transGenero) {
        embed.addField(
          t('commands:search.myanimelist.embed.genres'),
          transGenero.translated,
        );
      }

      if (property !== 'genres' && data[property]) {
        embed.addField(
          t(`commands:search.myanimelist.embed.${property}`),
          (['rating', 'status'].includes(property)
            ? t(`commands:search.myanimelist.${property}.${data[property].replace(/ /g, '-')}`)
            : data[property].replace('to', 'até')
          ),
          true,
        );
      }
    }

    return message.quote({ embed });
  }
}
