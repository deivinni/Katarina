import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { getWebImage } from '../../../util/wrappers';

export default class PatCommand extends Command {
  public constructor() {
    super('pat', {
      aliases: ['pat'],
      category: 'actions',
      description: {
        content: 'commands:actions.pat.description',
        usage: 'pat <@user>',
        example: 'pat @Katarina',
      },
      args: [{
        id: 'member',
        type: 'member',
        match: 'rest',
        prompt: {
          start: 'commands:actions.pat.arguments.start',
          retry: 'commands:actions.pat.arguments.retry',
        },
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<void> {
    return message.quote(new KatarinaEmbed(message.author)
      .setDescription(this.client.i18n.t('commands:actions.pat.message', { author: message.author.toString(), member: member.toString() }))
      .setImage((await getWebImage('random', { type: 'sfw', endpoint: 'pat' })).url),
    );
  }
}
