import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import Canvas from 'canvas';

import { KatarinaEmbed } from '../../../util/functions';

export default class WastedCommand extends Command {
  public constructor() {
    super('wasted', {
      aliases: ['wasted'],
      category: 'image',
      description: {
        content: 'commands:image.wasted',
        usage: 'wasted [@user]',
        examples: ['wasted', 'wasted @Katarina'],
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
    const base = await Canvas.loadImage('https://i.imgur.com/ChPmdLq.png');
    const img = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 1024 }));

    const canvas = Canvas.createCanvas(img.height, img.width);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage('attachment://wasted.png'),
      files: [{ name: 'wasted.png', attachment: canvas.toBuffer() }],
    });
  }
}
