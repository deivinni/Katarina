import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import Canvas from 'canvas';

import { KatarinaEmbed } from '../../../util/functions';
import { CanvasWrappers } from '../../../util/wrappers';

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

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const base = await Canvas.loadImage('https://i.imgur.com/60dU4A1.png');
    const img = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 1024 }));

    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    await CanvasWrappers.gray(ctx, img);

    ctx.fillStyle = '#00000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage('attachment://wasted.png'),
      files: [{ name: 'wasted.png', attachment: canvas.toBuffer() }],
    });
  }
}
