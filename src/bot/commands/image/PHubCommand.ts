import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import Canvas from 'canvas';

import { KatarinaEmbed, Util, shortenerText } from '../../../util/functions';

export default class PHUBCommand extends Command {
  public constructor() {
    super('pornhub', {
      aliases: ['pornhub', 'phub'],
      category: 'image',
      description: {
        content: 'commands:image.phub.description',
        usage: 'pornhub <message>',
        examples: ['pornhub oh yeah'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:image.phub.arguments.start',
            retry: 'commands:image.phub.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<void> {
    const image = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png', size: 1024 }));
    const base = await Canvas.loadImage('https://i.imgur.com/kUctlx3.png');

    const canvas = Canvas.createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 30, 310, 70, 70);

    ctx.font = '32px Arial';
    ctx.fillStyle = '#F99600';
    ctx.textAlign = 'start';
    ctx.fillText(shortenerText(message.author.username, 20), 115, 350);

    ctx.font = '32px Arial';
    ctx.fillStyle = '#CCCCCC';
    ctx.textAlign = 'start';
    await Util.renderEmoji(ctx, shortenerText(text, 40), 30, 430);

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage('attachment://phub.png'),
      files: [{ name: 'phub.png', attachment: canvas.toBuffer() }],
    });
  }
}
