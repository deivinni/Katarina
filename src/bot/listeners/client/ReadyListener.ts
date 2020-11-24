import { Listener } from 'discord-akairo';
// import { exec, ExecException } from 'child_process';

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

    // exec('java -jar Lavalink.jar', (error: ExecException) => {
    //   if (error) return this.client.logger.error(error);
    //   return this.client.logger.log('Lavalink inicializado com sucesso!', { tag: 'Lavalink' });
    // });

    return this.client.logger.log(`${this.client.user.tag} inicializada com sucesso!`, { tag: 'Ready' });
  }
}
