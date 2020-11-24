import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class BlurCommand extends Command {
  public constructor() {
    super('blur', {
      aliases: ['blur'],
      category: 'image',
      description: {
        content: 'commands:image.blur',
        usage: 'blur [@user]',
        examples: ['blur @Katarina'],
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
    const url = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('blur', { url });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://blur.${format}`),
      files: [{ name: `blur.${format}`, attachment: image }],
    });
  }
}
