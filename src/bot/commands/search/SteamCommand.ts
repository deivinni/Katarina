import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import axios from 'axios';
import { formatNumber, KatarinaEmbed, shortenerText } from '../../../util/functions';
import { Translate } from '../../../util/wrappers';

/* eslint-disable no-unused-expressions */

export default class SteamCommand extends Command {
  public constructor() {
    super('steam', {
      aliases: ['steam'],
      category: 'search',
      description: {
        content: 'commands:search.steam.description',
        usage: 'steam <game>',
        examples: ['steam "dota 2"', 'steam sekiro'],
      },
      args: [{
        id: 'game',
        type: 'string',
        match: 'phrase',
        prompt: {
          start: 'commands:search.steam.arguments.start',
          retry: 'commands:search.steam.arguments.retry',
        },
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { game }: { game: string }): Promise<void> {
    const { t } = this.client.i18n;
    const { data } = await axios('https://store.steampowered.com/api/storesearch', { params: { l: 'pt', cc: 'br', term: game } });

    if (data.total === 0) return message.quote(t('commands:search.steam.gameNotFound'));

    let { data: body } = await axios('https://store.steampowered.com/api/appdetails', { params: { appids: data.items[0].id, l: 'pt', cc: 'br' } });
    body = body[`${data.items[0].id}`];

    if (!body.success) return message.quote(t('commands:search.steam.unsuccessfully'));

    const current = body.data.price_overview ? formatNumber(body.data.price_overview.final / 100) : t('commands:search.steam.free');
    const original = body.data.price_overview ? formatNumber(body.data.price_overview.initial / 100) : t('commands:search.steam.free');
    const price = current === original
      ? t('commands:search.steam.current', { current })
      : t('commands:search.steam.promotion', { original, current });

    const platform = [];
    if (body.data.platforms) {
      if (body.data.platforms.windows) platform.push('Windows');
      if (body.data.platforms.mac) platform.push('Mac');
      if (body.data.platforms.linux) platform.push('Linux');
    }

    const emoji = '<:Think:634436345153978379>';
    const embed: KatarinaEmbed = new KatarinaEmbed(message.author)
      .setAuthor(
        shortenerText(body.data.name, 33),
        'https://cdn.discordapp.com/emojis/637639976648966164.png?v=1',
        `https://store.steampowered.com/app/${data.items[0].id}/${encodeURIComponent(body.data.name)}`,
      )
      .setImage(data.items[0].tiny_image.replace('231', '616').replace('87', '353'));

    body.data.short_description
      ? embed.setDescription(
        (await Translate(
          body.data.short_description.replace(/<[^>]*>?/gm, ''),
          { to: 'pt' },
        )).translated,
      )
      : null;

    embed
      .addField(t('commands:search.steam.embed.information.name'), [
        t('commands:search.steam.embed.information.requiredAge', { data: body.data.required_age || 'livre' }),
        t('commands:search.steam.embed.information.dlc', { data: body.data.dlc ? body.data.dlc.length : 'nenhuma' }),
        t('commands:search.steam.embed.information.price', { data: price }),
        t('commands:search.steam.embed.information.releaseDate', { data: body.data.release_date ? body.data.release_date.date : emoji }),
        t('commands:search.steam.embed.information.platforms', { data: platform.join(', ') || emoji }),
        t('commands:search.steam.embed.information.developers', { data: body.data.developers ? body.data.developers.join(', ') : emoji }),
      ], true)
      .addField('\u200b', [
        t('commands:search.steam.embed.information.score', { data: body.data.metacritic ? body.data.metacritic.score : emoji }),
        t('commands:search.steam.embed.information.site', { data: body.data.website ? `[clique aqui](${body.data.website})` : emoji }),
        t('commands:search.steam.embed.information.recommendations', { data: body.data.recommendations ? body.data.recommendations.total : emoji }),
        t('commands:search.steam.embed.information.achievements', { data: body.data.achievements ? body.data.achievements.total : emoji }),
        t('commands:search.steam.embed.information.publishers', { data: body.data.publishers ? (body.data.publishers as string[]).join(', ') : emoji }),
        t('commands:search.steam.embed.information.genres', { data: body.data.genres ? body.data.genres.map((c) => c.description).join(', ') : emoji }),
      ], true);

    if (body.data.pc_requirements) {
      let string: string = '';

      if (body.data.pc_requirements.minimum) {
        string += t('commands:search.steam.embed.requirements.minimum', {
          data: body.data.pc_requirements.minimum
            .replace('<strong>Minimum:</strong><br><ul class="bb_ul"><li><strong>', '')
            .replace(/<br>/g, '\n')
            .replace(/<[^>]*>?/gm, ''),
        });
      }
      if (body.data.pc_requirements.recommended) {
        string += t('commands:search.steam.embed.requirements.recommended', {
          data: body.data.pc_requirements.recommended
            .replace('<strong>Recommended:</strong><br><ul class="bb_ul"><li><strong>', '')
            .replace(/<br>/, '\n')
            .replace(/<[^>]*>?/m, ''),
        });
      }

      embed.addField(t('commands:search.steam.embed.requirements.name'), string);
    }

    return message.quote(embed);
  }
}
