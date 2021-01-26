import { AkairoClient } from 'discord-akairo';
// import { Message, TextChannel } from 'discord.js';
import i18next, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import * as fs from 'fs';
import { join, resolve } from 'path';

// import * as _config from '../config';

export class I18next {
  public client!: AkairoClient;
  public constructor(client: AkairoClient) {
    this.client = client;
  }

  public t(key: string, options?: Record<string, unknown>): string {
    const language = this.language();

    return language(key, options);
  }

  public language(/* guild?: string */) {
    // const guildLanguage = guild ? this.client.database.guild.get() : undefined;
    // const language = guildLanguage ? this.Languages().get(guildLanguage) : undefined;
    const portuguese = this.allLanguages().get('pt_BR');

    return /* language || */ portuguese;
  }

  private walkDirectory(dir: string, ns: string[] = [], folderName = ''): { namespaces: string[]; languages: string[]; } {
    const files = fs.readdirSync(dir);

    const languages: string[] = [];
    for (const file of files) {
      const stat = fs.statSync(join(dir, file));
      if (stat.isDirectory()) {
        const isLanguage = file.includes('-') || file.includes('_');
        if (isLanguage) languages.push(file);

        const folder = this.walkDirectory(join(dir, file), ns, isLanguage ? '' : `${file}/`);
        ns = folder.namespaces;
      } else {
        ns.push(`${folderName}${file.substr(0, file.length - 5)}`);
      }
    }

    return {
      namespaces: [...new Set(ns)],
      languages,
    };
  }

  public allLanguages(): Map<string, TFunction> {
    const { namespaces, languages } = this.walkDirectory(resolve(__dirname, '../..', 'bot/languages'));

    i18next
      .use(Backend)
      .init({
        backend: {
          jsonIndent: 2,
          loadPath: `${resolve(__dirname, '../..', 'bot/languages')}/{{lng}}/{{ns}}.json`,
        },
        debug: false,
        fallbackLng: 'pt_BR',
        initImmediate: false,
        interpolation: { escapeValue: false },
        load: 'all',
        lng: 'pt_BR',
        ns: namespaces,
        preload: languages,
        saveMissing: true,
        // missingKeyHandler(lng: string[], ns: string, key: string, fallbackValue: string): Promise<Message> {
        //   const response = `Missing translation key: ${ns}:${key} for \`${lng.join('`, `')}\` language. Instead using: \`${fallbackValue}\``;
        //   this.client.logger.warn(response);

        //   if (!_config.channelIDs.missingTranslation) return;

        //   const channel = this.client.channels.cache.get(_config.channelIDs.missingTranslation);
        //   if (!channel) return;

        //   // eslint-disable-next-line consistent-return
        //   return (channel as TextChannel).send(response);
        // },
      }, undefined);

    return new Map(languages.map((item) => [item, i18next.getFixedT(item)]));
  }
}
