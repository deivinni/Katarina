import Canvas from 'canvas';
import { Command } from 'discord-akairo';
import { Activity, Message, User } from 'discord.js';

import { Util, KatarinaEmbed, shortenerText } from '../../../util/functions';

export default class SpotifyCommand extends Command {
  public constructor() {
    super('spotify', {
      aliases: ['spotify'],
      category: 'util',
      description: {
        content: 'commands:util.spotify.description',
        usage: 'spotify [@user]',
        examples: ['spotify', 'spotify @Katarina'],
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

  public async exec(message: Message, { user }: { user: User }) {
    if (user.bot) return message.util?.reply(this.client.i18n.t('commands:fun.spotify.userBot'));

    if (!user.presence.activities.find(
      (status: Activity) => status.type === 'LISTENING' && status.name === 'Spotify')
    ) {
      return message.util?.reply(
        this.client.i18n.t('commands:fun.spotify.noListeningSpotify', { name: user.id === message.author.id ? this.client.i18n.t('commands:fun.spotify.author') : this.client.i18n.t('commands:fun.spotify.another') }),
      );
    }

    const presence = user.presence.activities[user.presence.activities.findIndex((status: Activity) => status.type === 'LISTENING' && status.name === 'Spotify')];

    const total = presence.timestamps.end.getTime() - presence.timestamps.start.getTime();
    const progress = Date.now() - presence.timestamps.start.getTime();
    const progressF = Util.formatTime(progress > total ? total : progress);
    const ending = Util.formatTime(total);

    const canvas = Canvas.createCanvas(500, 150);
    const ctx = canvas.getContext('2d');

    const calculateProgress = (progress: number, total: number) => {
      const prg = (progress / total) * 300;
      if (Number.isNaN(prg) || prg < 0) return 0;
      if (prg > 300) return 300;
      return prg;
    };

    // background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2F3136';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw image
    const img = await Canvas.loadImage(presence.assets.largeImageURL());
    ctx.drawImage(img, 0, 0, 150, 150);

    // draw song name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    await Util.renderEmoji(ctx, shortenerText(presence.details, 30), 160, 35);

    // draw artist name
    ctx.fillStyle = '#F1F1F1';
    ctx.font = '14px Arial';
    await Util.renderEmoji(ctx, `by ${shortenerText(presence.state, 45)}`, 160, 65);

    // add album
    if (presence.assets.largeText && typeof presence.assets.largeText === 'string') {
      ctx.fillStyle = '#F1F1F1';
      ctx.font = '14px Arial';
      await Util.renderEmoji(ctx, `on ${shortenerText(presence.assets.largeText, 40)}`, 160, 85);
    }

    // ending point
    ctx.fillStyle = '#B3B3B3';
    ctx.font = '14px Arial';
    await Util.renderEmoji(ctx, ending, 430, 140);

    // progress
    ctx.fillStyle = '#B3B3B3';
    ctx.font = '14px Arial';
    await Util.renderEmoji(ctx, progressF, 160, 140);

    // progress bar track
    ctx.rect(160, 160, 305, 5);
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(160, 120, 305, 5);

    // progress bar
    ctx.fillStyle = '#1DB954';
    ctx.fillRect(160, 120, calculateProgress(progress, total), 5);

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage('attachment://spotify.png'),
      files: [
        { name: 'spotify.png', attachment: canvas.toBuffer() },
      ],
    });
  }
}
