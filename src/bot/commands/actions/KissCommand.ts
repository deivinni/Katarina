import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { getWebImage } from '../../../util/wrappers';

export default class KissCommand extends Command {
  public constructor() {
    super('kiss', {
      aliases: ['kiss'],
      category: 'actions',
      description: {
        content: 'commands:actions.kiss.description',
        usage: 'kiss <@user>',
        example: 'kiss @Katarina',
      },
      args: [{
        id: 'member',
        type: 'member',
        match: 'rest',
        prompt: {
          start: 'commands:actions.kiss.arguments.start',
          retry: 'commands:actions.kiss.arguments.retry',
        },
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<void> {
    return message.quote(new KatarinaEmbed(message.author)
      .setDescription(this.client.i18n.t('commands:actions.kiss.message', { author: message.author.toString(), member: member.toString() }))
      .setImage((await getWebImage('random', { type: 'sfw', endpoint: 'kiss' })).url),
    );
  }
}
