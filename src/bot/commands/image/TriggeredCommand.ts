import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import Canvas from 'canvas';
import GifEncoder from 'gifencoder';

import { KatarinaEmbed } from '../../../util/functions';

export default class TriggeredCommand extends Command {
  public constructor() {
    super('triggered', {
      aliases: ['triggered'],
      category: 'image',
      description: {
        content: 'commands:image.triggered',
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

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const base = await Canvas.loadImage('https://i.imgur.com/3OZdbyy.png');
    const img = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 1024 }));
    const gif = new GifEncoder(img.width, img.height);

    gif.start();
    gif.setRepeat(0);
    gif.setDelay(15);

    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    const BR = 30;
    const LR = 20;

    let i = 0;
    while (i < 9) {
      ctx.clearRect(0, 0, img.width, img.height);

      ctx.drawImage(
        img,
        Math.floor(Math.random() * BR) - BR,
        Math.floor(Math.random() * BR) - BR,
        img.width + BR,
        img.width - 54 + BR,
      );

      ctx.fillStyle = '#FF000033';
      ctx.fillRect(0, 0, img.width, img.height);

      ctx.drawImage(
        base,
        Math.floor(Math.random() * LR) - LR,
        img.height - 54 + Math.floor(Math.random() * LR) - LR,
        img.height + LR,
        54 + LR,
      );

      gif.addFrame(ctx);

      // eslint-disable-next-line no-plusplus
      i++;
    }
    gif.finish();

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage('attachment://triggered.gif'),
      files: [{ name: 'triggered.gif', attachment: gif.out.getData() }],
    });
  }
}
