import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class AvatarCommand extends Command {
  public constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: 'utilidade',
      description: {
        content: 'commands:avatar.description',
        usage: 'avatar @user',
        example: ['avatar @Katarina'],
      },
      args: [{
        id: 'member',
        type: 'member',
        match: 'rest',
        default: (message: Message) => message.member,
      }],
      ratelimit: 3,
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
    const avatar = member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true });

    return message.channel.send(
      new KatarinaEmbed(message.author)
        .setDescription(this.client.i18n.t('commands:avatar.embed', { avatar, member: `${member}` }))
        .setImage(avatar),
    );
  }
}
