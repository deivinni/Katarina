import { Command } from 'discord-akairo';
import {
  Activity, Message, MessageEmbed, User,
} from 'discord.js';

import DayJS from 'dayjs';
import DayJSLocalizedFormat from 'dayjs/plugin/localizedFormat';
import DayJSRelativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

import { shortenerText } from '../../../util/functions';

DayJS.locale('pt-br');
DayJS.extend(DayJSLocalizedFormat);
DayJS.extend(DayJSRelativeTime);

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

    return message.quote(new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(member.displayHexColor !== '#000000' ? member.displayHexColor : 0x2f3136)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField(this.client.i18n.t('commands:info.userinfo.embed-field-information'), [
        this.client.i18n.t('commands:info.userinfo.embed-tag', { data: `${shortenerText(user.username, 30)}#${user.discriminator}` }),
        this.client.i18n.t('commands:info.userinfo.embed-id', { data: user.id }),
        this.client.i18n.t('commands:info.userinfo.embed-nick', { data: shortenerText(member.nickname || 'nenhum', 30) }),
        `•\u2000Status: ${this.client.i18n.t(`commands:info.userinfo.status.${user.presence.status}`)}`,
        (
          presence
            ? this.client.i18n.t('commands:info.userinfo.embed-custom_status', { data: shortenerText(presence.state, 100) })
            : null
        ),
      ])
      .addField(this.client.i18n.t('commands:info.userinfo.embed-field-date'), [
        this.client.i18n.t('commands:info.userinfo.embed-created', { data: `\`${DayJS(user.createdAt).format('ll')}\` (\`${DayJS().to(user.createdAt)}\`)` }),
        this.client.i18n.t('commands:info.userinfo.embed-joined', { data: `\`${DayJS(member.joinedAt).format('ll')}\` (\`${DayJS().to(member.joinedAt)}\`)` }),
        (
          member.premiumSince
            ? this.client.i18n.t('commands:info.userinfo.embed-boost', { data: `\`${DayJS(member.premiumSince).format('ll')}\` (\`${DayJS().to(member.premiumSince)}\`)` })
            : null
        ),
      ])
      .addField(this.client.i18n.t('commands:info.userinfo.embed-field-extra'), [
        this.client.i18n.t('commands:info.userinfo.embed-highest', { data: String(member.roles.highest) || '`sem cargo`' }),
        `•\u2000Badges: ${(await user.fetchFlags()).toArray().map((f: string) => this.client.i18n.t(`commands:info.userinfo.badges.${f}`)).join('') || '`nenhum`'}`,
      ]),
    );
  }
}
