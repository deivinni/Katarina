import { MessageEmbed, User } from 'discord.js';

export class KatarinaEmbed extends MessageEmbed {
  public constructor(user?: User, data = {}) {
    super(data);

    this.setColor(0x2f3136);

    if (user) this.setAuthor(user.username, user.displayAvatarURL({ dynamic: true }));
  }

  public arrayDescription(messages: string[][]): KatarinaEmbed {
    return this.setDescription(
      messages
        .map((lines) => lines.filter((x) => !!x).join('\n'))
        .filter((x) => !!x.length)
        .join('\n\n'),
    );
  }

  public arrayField(name: string, value: string[][], inline?: boolean): KatarinaEmbed {
    return this.addField(
      name,
      value
        .map((lines) => lines.filter((x) => !!x).join('\n'))
        .filter((x) => !!x.length)
        .join('\n\n'),
      inline,
    );
  }

  public setTitleURL(name: string, url: string): KatarinaEmbed {
    return this.setTitle(name).setURL(url);
  }

  public setTimeFooter(name: string, icon?: string, time?: number): KatarinaEmbed {
    return this
      .setFooter(name, icon)
      .setTimestamp(time || new Date());
  }
}
