import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { KatarinaEmbed, shortenerText } from '../../../util/functions';
import { Translate } from '../../../util/wrappers';

export default class TranslateCommand extends Command {
  public constructor() {
    super('translate', {
      aliases: ['translate', 'trans'],
      category: 'util',
      description: {
        content: 'commands:util.translate.description',
        usage: 'translate <language> <text>',
        examples: ['translate pt hello', 'translate en olá'],
      },
      args: [{
        id: 'to',
        type: 'string',
        match: 'phrase',
        prompt: {
          start: 'commands:util.translate.arguments.toStart',
          retry: 'commands:util.translate.arguments.toRetry',
        },
      }, {
        id: 'text',
        type: 'string',
        match: 'rest',
        prompt: {
          start: 'commands:util.translate.arguments.textStart',
          retry: 'commands:util.translate.arguments.textRetry',
        },
      }],
      ratelimit: 3,
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { to, text }: { to: string, text: string }): Promise<void> {
    if (text.length > 1020) return message.quote(this.client.i18n.t('commands:util.translate.textLen'));

    try {
      const trans = await Translate(text, { to });

      return message.quote(
        new KatarinaEmbed(message.author)
          .setTitleURL(this.client.i18n.t('commands:util.translate.embed.title') as string, trans.url)
          .setThumbnail('https://i.imgur.com/RBFetrT.gif')
          .setDescription(shortenerText(trans.translated, 2048))
          .addField(
            this.client.i18n.t('commands:util.translate.embed.field') as string,
            shortenerText(trans.original, 1024),
          ),
      );
    } catch {
      return message.quote(this.client.i18n.t('commands:util.translate.translateError'));
    }
  }
}
