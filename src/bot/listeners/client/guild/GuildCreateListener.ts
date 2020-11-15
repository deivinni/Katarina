import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';

export default class GuildCreate extends Listener {
  public constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      category: 'client',
      emitter: 'client',
    });
  }

  public async exec(guild: Guild): Promise<void> {
    this.client.user.setActivity(
      `${this.client.config.prefix[0]}help | ${this.client.guilds.cache.size} servidores!`, {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/monstercat',
      },
    );

    const channel = this.client.channels.cache.get(this.client.config.channelIDs.readyLogs);
    if (channel) {
      (channel as TextChannel).send([
        `<:Online:612325153317060623> \`|\` Entrei no servidor **${guild.name}**`,
        `> Dono: **${(await this.client.users.fetch(guild.ownerID)).tag}**`,
        `> Quantidade de membros: **${guild.members.cache.filter((m) => !m.user.bot).size}**`,
        `> Quantidade de bots   : **${guild.members.cache.filter((m) => m.user.bot).size}**`,
      ]);
    }

    return undefined;
  }
}
