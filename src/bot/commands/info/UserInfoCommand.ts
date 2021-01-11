import { Command } from 'discord-akairo';
import {
  Activity, Message, MessageEmbed, User,
} from 'discord.js';

import moment from 'moment';

import { /* KatarinaEmbed, */ shortenerText } from '../../../util/functions';

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

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const status = {
      online: '<:Online:612325153317060623> disponível',
      offline: '<:Offline:612325152759480332> invisível',
      idle: '<:Idle:612324956390555655> ausente',
      dnd: '<:Dnd:612324956025520168> ocupado',
      steam: '<:Streaming:612325157213700170> transmitindo',
    };
    const badges = {
      DISCORD_EMPLOYEE: '<:Staff:612325155108028456>',
      PARTNERED_SERVER_OWNER: '<:partner:797977367380230224>',
      HYPESQUAD_EVENTS: '<:hypersquadevents:797977299173507103>',
      BUGHUNTER_LEVEL_1: '<:BugHunter:612324953752076300>',
      HOUSE_BRAVERY: '<:HypesquadBravery:612324956210200586>',
      HOUSE_BRILLIANCE: '<:HypesquadBrilliance:612324956394618890>',
      HOUSE_BALANCE: '<:HypesquadBalance:612324956147286017>',
      EARLY_SUPPORTER: '<:earlysupporter:797977277622386708>',
      SYSTEM: '<:system:797977426982338572>',
      BUGHUNTER_LEVEL_2: '<:bughunter2:797977257888841818>',
      VERIFIED_BOT: '<:verified_bot:797977455134638160>',
      // EARLY_VERIFIED_BOT_DEVELOPER: '<:verified_developer:797977463963254804>',
      VERIFIED_DEVELOPER: '<:verified_developer:797977463963254804>',
    };
    const member = message.guild.member(user);

    return message.quote(new MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(member.displayHexColor !== '#000000' ? member.displayHexColor : 0x2f3136)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('<:Seta:617359896379392003> Informações', [
        `•\u2000Tag: \`${shortenerText(user.username, 30)}#${user.discriminator}\``,
        `•\u2000ID: \`${user.id}\``,
        `•\u2000Apelido: \`${shortenerText(member.nickname || 'nenhum', 30)}\``,
        `•\u2000Status: ${status[user.presence.status]}`,
        (
          user.presence.activities.find((status: Activity) => status.type === 'CUSTOM_STATUS')
            ? `•\u2000Status customizado: \`${shortenerText(user.presence.activities.find((status: Activity) => status.type === 'CUSTOM_STATUS').state, 100)}\``
            : null
        ),
      ])
      .addField('<:Seta:617359896379392003> Datas', [
        `•\u2000Criação da conta: \`${moment(user.createdAt).format('ll').toLowerCase()}\``,
        `•\u2000Entrou no servidor: \`${moment(member.joinedAt).format('ll').toLowerCase()}\``,
        (
          member.premiumSince
            ? `•\u2000Impulsionador (deste servidor): \`${moment(member.premiumSince).format('ll').toLowerCase()}\``
            : null
        ),
      ])
      .addField('<:Seta:617359896379392003> Extra', [
        `•\u2000Cargo mais alto: ${member.roles.highest || '`sem cargo`'}`,
        `•\u2000Badges: ${(await user.fetchFlags()).toArray().map((f: string) => badges[f]).join('') || '`nenhum`'}`,
      ]),
    );
  }
}
