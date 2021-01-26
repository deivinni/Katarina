import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { find } from 'weather-js';

import { capitalize, KatarinaEmbed } from '../../../util/functions';

export default class WeatherCommand extends Command {
  public constructor() {
    super('weather', {
      aliases: ['weather'],
      category: 'search',
      description: {
        content: 'commands:search.weather.description',
        usage: 'weather <city> [-week]',
        examples: ['weather "tokyo"', 'weather "new york"', 'weather "são paulo" -week'],
      },
      args: [{
        id: 'city',
        type: 'string',
        match: 'phrase',
        prompt: {
          start: 'commands:search.weather.arguments.start',
          retry: 'commands:search.weather.arguments.retry',
        },
      }, {
        id: 'week',
        match: 'flag',
        flag: ['-week', '-semana'],
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { city, week }: { city: string, week: boolean }): Promise<(void|Message)> {
    find({ search: city, degreeType: 'C', lang: 'pt-BR' }, (error, response) => {
      if (error) {
        this.client.logger.error(error.stack);
        return message.quote(this.client.i18n.t('commands:search.weather.error'));
      }
      if (!response) return message.quote(this.client.i18n.t('commands:search.weather.noResponse'));

      const [{ current, location, forecast }] = response;
      const embed = new KatarinaEmbed(message.author)
        .setTitle(this.client.i18n.t('commands:search.weather.embed.title', { city: location.name }));

      if (!week) {
        embed
          .setThumbnail(current.imageUrl)
          .arrayDescription([
            [
              this.client.i18n.t('commands:search.weather.embed.description.city', { name: location.name }),
              this.client.i18n.t('commands:search.weather.embed.description.coordinates', { lat: location.lat, long: location.long }),
              this.client.i18n.t('commands:search.weather.embed.description.timezone', { tz: location.timezone }),
            ],
            [
              this.client.i18n.t('commands:search.weather.embed.description.temperature', { temp: current.temperature }),
              this.client.i18n.t('commands:search.weather.embed.description.feelslike', { fl: current.feelslike }),
              this.client.i18n.t('commands:search.weather.embed.description.observationtime', { ot: current.observationtime }),
              this.client.i18n.t('commands:search.weather.embed.description.winddisplay', { wd: current.winddisplay }),
              this.client.i18n.t('commands:search.weather.embed.description.humidity', { humidity: current.humidity }),
            ],
          ]);
      } else {
        for (let i: number = 0; i < forecast.length; i++) { // eslint-disable-line no-plusplus
          embed.addField(capitalize(forecast[i].day), [
            this.client.i18n.t('commands:search.weather.embed.field.temperature', {
              low: forecast[i].low.length > 0 ? forecast[i].low : forecast[i].high,
              high: forecast[i].high.length > 0 ? forecast[i].high : forecast[i].low,
            }),
            this.client.i18n.t('commands:search.weather.embed.field.climate', { climate: forecast[i].skytextday }),
          ]);
        }
      }

      return message.quote(embed);
    });
  }
}
