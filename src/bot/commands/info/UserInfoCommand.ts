import { Command } from 'discord-akairo';
import {
  Activity, Message, MessageEmbed, User,
} from 'discord.js';

import moment from 'moment';

import { shortenerText } from '../../../util/functions';

moment.locale('pt-BR');

export default class UserInfoCommand extends Command {
  public constructor() {
    super('userinfo', {
      aliases: ['userinfo', 'user'],
      category: 'info',
      description: {
        content: 'commands:info.userinfo.description',
        usage: 'userinfo [@user]',
        examples: ['userinfo', 'userinfo @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          default: (message: Message) => message.author,
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<(void|Message)> {
    const member = message.guild.member(user);
    const presence = user.presence.activities.find((status: Activity) => status.type === 'CUSTOM_STATUS');
    const { t } = this.client.i18n;

    return message.quote(new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(member.displayHexColor !== '#000000' ? member.displayHexColor : 0x2f3136)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField(t('commands:info.userinfo.embed-field-information'), [
        t('commands:info.userinfo.embed-tag', { data: `${shortenerText(user.username, 30)}#${user.discriminator}` }),
        t('commands:info.userinfo.embed-id', { data: user.id }),
        t('commands:info.userinfo.embed-nick', { data: shortenerText(member.nickname || 'nenhum', 30) }),
        `•\u2000Status: ${t(`commands:info.userinfo.status.${user.presence.status}`)}`,
        (
          presence
            ? t('commands:info.userinfo.embed-custom_status', { data: shortenerText(presence.state, 100) })
            : null
        ),
      ])
      .addField(t('commands.info.userinfo.embed-field-date'), [
        t('commands:info.userinfo.embed-created', { data: moment(user.createdAt).format('ll').toLowerCase() }),
        t('commands:info.userinfo.embed-joined', { data: moment(member.joinedAt).format('ll').toLowerCase() }),
        (
          member.premiumSince
            ? t('commands:info.userinfo.embed-boost', { data: moment(member.premiumSince).format('ll').toLowerCase() })
            : null
        ),
      ])
      .addField(t('commands:info.userinfo.embed-field-extra'), [
        t('commands:info.userinfo.embed-highest', { data: member.roles.highest || '`sem cargo`' }),
        `•\u2000Badges: ${(await user.fetchFlags()).toArray().map((f: string) => t(`commands:info.userinfo.badges.${f}`)).join('') || '`nenhum`'}`,
      ]),
    );
  }
}
