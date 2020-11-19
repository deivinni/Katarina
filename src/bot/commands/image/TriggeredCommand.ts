import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class TriggeredCommand extends Command {
  public constructor() {
    super('triggered', {
      aliases: ['triggered'],
      category: 'image',
      description: {
        content: 'commands:triggered.description',
        usage: 'triggered [@user]',
        examples: ['triggered', 'triggered @Katarina'],
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

  public async exec(message: Message, { user }: { user: User }): Promise<Message> {
    const avatar = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('triggered', { url: avatar });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://triggered.${format}`),
      files: [{ name: `triggered.${format}`, attachment: image }],
    });
  }
}
