import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class AvatarCommand extends Command {
  public constructor() {
    super('avatar', {
      aliases: ['avatar', 'pic'],
      category: 'util',
      description: {
        content: 'commands:util.avatar.description',
        usage: 'avatar @user',
        examples: ['avatar @Katarina'],
      },
      args: [
        {
          id: 'member',
          type: 'member',
          match: 'rest',
          default: (message: Message) => message.member,
        },
      ],
      ratelimit: 3,
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<void> {
    const avatar = member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true });

    return message.quote(
      new KatarinaEmbed(message.author)
        .setDescription(this.client.i18n.t('commands:util.avatar.embed', { avatar, member: `${member}` }))
        .setImage(avatar),
    );
  }
}
