import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import Canvas from 'canvas';

import { Util, KatarinaEmbed } from '../../../util/functions';

export default class ChangeMyMindCommand extends Command {
  public constructor() {
    super('changemymind', {
      aliases: ['changemymind', 'cmm'],
      category: 'image',
      description: {
        content: 'commands:image.changemymind.description',
        usage: 'changemymind <text>',
        examples: ['changemymind AAAAAAAAAAAAAAAAB'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:image.changemymind.arguments.start',
            retry: 'commands:image.changemymind.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<void> {
    const base = await Canvas.loadImage('https://i.imgur.com/CJM5Dgs.jpg');
    const canvas = Canvas.createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    const x = text.length;

    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

    let fontSize = 70;
    if (x <= 15) {
      ctx.translate(310, 365);
    } else if (x <= 30) {
      fontSize = 50;
      ctx.translate(315, 365);
    } else if (x <= 70) {
      fontSize = 40;
      ctx.translate(315, 365);
    } else if (x <= 85) {
      fontSize = 32;
      ctx.translate(315, 365);
    } else if (x < 100) {
      fontSize = 26;
      ctx.translate(315, 365);
    } else if (x < 120) {
      fontSize = 21;
      ctx.translate(315, 365);
    } else if (x < 180) {
      fontSize = 0.0032 * (x * x) - 0.878 * x + 80.545;
      ctx.translate(315, 365);
    } else if (x < 700) {
      fontSize = 0.0000168 * (x * x) - 0.0319 * x + 23.62;
      ctx.translate(310, 338);
    } else {
      fontSize = 7;
      ctx.translate(310, 335);
    }

    ctx.font = `${fontSize}px 'Arial'`;
    ctx.rotate(-0.39575);

    const lines = Util.getLines({ text, ctx, maxWidth: 345 });

    let i = 0;
    while (i < lines.length) {
      ctx.fillText(lines[i], 10, i * fontSize - 5);

      // eslint-disable-next-line no-plusplus
      i++;
    }

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage('attachment://changemymind.jpg'),
      files: [{ name: 'changemymind.jpg', attachment: canvas.toBuffer() }],
    });
  }
}
