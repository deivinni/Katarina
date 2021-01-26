import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { getWebImage } from '../../../util/wrappers';

export default class SlapCommand extends Command {
  public constructor() {
    super('slap', {
      aliases: ['slap'],
      category: 'actions',
      description: {
        content: 'commands:actions.slap.description',
        usage: 'slap <@user> ["message"]',
        example: 'slap @Katarina "AAAAAAAAAAAAAAAAAAAAAAAA"',
      },
      args: [{
        id: 'member',
        type: 'member',
        match: 'phrase',
        prompt: {
          start: 'commands:actions.slap.arguments.start',
          retry: 'commands:actions.slap.arguments.retry',
        },
      }, {
        id: 'msg',
        type: 'string',
        match: 'phrase',
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { member, msg }: { member: GuildMember, msg: string }): Promise<void> {
    return message.quote(new KatarinaEmbed(message.author)
      .setDescription([this.client.i18n.t('commands:actions.slap.message', { author: message.author.toString(), member: member.toString() }), msg ? `"_${msg}_"` : ''])
      .setImage((await getWebImage('random', { type: 'sfw', endpoint: 'slap' })).url),
    );
  }
}
