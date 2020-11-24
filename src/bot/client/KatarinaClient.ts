import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Message, Intents } from 'discord.js';
import { join } from 'path';
import * as dagpi from 'dagpijs';

import * as _config from '../../util/config';
import { Logger } from '../../util/functions';
import { I18next } from '../../util/wrappers';

export default class KatarinaClient extends AkairoClient {
  public constructor(config: IClientConfig) {
    super({
      ownerID: _config.owner,
      disableMentions: 'everyone',
      ws: {
        intents: [Intents.ALL],
      },
    });

    this.config = config;
    this.logger = new Logger();
    this.i18n = new I18next(this);
    this.dagpi = new dagpi.Client(process.env.DAGPI);
  }

  public _init(): Promise<string> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();

    return super.login(_config.token);
  }

  public listenerHandler: ListenerHandler = new ListenerHandler(this, { directory: join(__dirname, '..', 'listeners') });
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: _config.prefix,
    blockBots: true,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 3e4,
    argumentDefaults: {
      prompt: {
        modifyStart: (msg: Message, str: string) => `${msg.author}, ${this.i18n.t(str)}, ${this.i18n.t('listeners:commandHandler.arguments.start')}`,
        modifyRetry: (msg: Message, str: string) => `${msg.author}, ${this.i18n.t(str)}, ${this.i18n.t('listeners:commandHandler.arguments.retry')}`,
        timeout: (msg: Message) => `${msg.author}, ${this.i18n.t('listeners:commandHandler.arguments.timeout')}`,
        ended: (msg: Message) => `${msg.author}, ${this.i18n.t('listeners:commandHandler.arguments.ended')}`,
        cancel: (msg: Message) => `${msg.author}, ${this.i18n.t('listeners:commandHandler.arguments.cancel')}`,
        retries: 3,
        time: 3e4,
      },
      otherwise: '',
    },
    ignorePermissions: _config.owner,
  });
}

declare module 'discord-akairo' {
  interface AkairoClient { // eslint-disable-line no-unused-vars
    listenerHandler: ListenerHandler;
    commandHandler: CommandHandler;
    logger: Logger;
    config: IClientConfig;
    i18n: I18next;
    dagpi: dagpi.Client;
  }
}

interface IClientConfig {
  token: string;
  prefix: string | Array<string>;
  owner: string | Array<string>;
  channelIDs: {
    missingTranslation: string;
    readyLogs: string;
    guildLogs: string;
    databaseLogs: string;
    errorLogs: string;
  };
}
