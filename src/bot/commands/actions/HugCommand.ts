import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';
import { getWebImage } from '../../../util/wrappers';

export default class HugCommand extends Command {
  public constructor() {
    super('hug', {
      aliases: ['hug'],
      category: 'actions',
      description: {
        content: 'commands:actions.hug.description',
        usage: 'hug <@user>',
        example: ['hug @Katarina'],
      },
      args: [{
        id: 'member',
        type: 'member',
        match: 'rest',
        prompt: {
          start: 'commands:actions.hug.arguments.start',
          retry: 'commands:actions.hug.arguments.retry',
        },
      }],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<void> {
    return message.quote(new KatarinaEmbed(message.author)
      .setDescription(this.client.i18n.t('commands:actions.hug.message', { author: message.author.toString(), member: member.toString() }))
      .setImage((await getWebImage('random', { type: 'sfw', endpoint: 'hug' })).url),
    );
  }
}
