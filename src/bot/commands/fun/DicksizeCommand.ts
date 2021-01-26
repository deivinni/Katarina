import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class DicksizeCommand extends Command {
  public constructor() {
    super('dicksize', {
      aliases: ['dicksize'],
      category: 'fun',
      description: {
        content: 'commands:fun.dicksize',
        usage: 'dicksize',
        examples: ['dicksize'],
      },
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message): Promise<void> {
    const math = (Number(message.author.id.slice(-3)) % 20) + 1;

    return message.quote(new KatarinaEmbed(message.author)
      .setDescription([
        `${math} cm`,
        `8${'='.repeat(math)}D`,
      ]),
    );
  }
}
