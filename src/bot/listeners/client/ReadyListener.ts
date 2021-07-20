import { Listener } from 'discord-akairo';

export default class Ready extends Listener {
  public constructor() {
    super('ready', {
      event: 'ready',
      category: 'client',
      emitter: 'client',
      type: 'once',
    });
  }

  public exec(): void {
    this.client.user.setActivity(
      `${this.client.config.prefix[0]}help | ${this.client.guilds.cache.size} servidores!`, {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/monstercat',
      },
    );

    this.client.logger.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");

    return this.client.logger.log(`${this.client.user.tag} inicializada com sucesso!`, { tag: 'Ready' });
  }
}
