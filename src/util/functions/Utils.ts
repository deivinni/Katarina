import emoji from 'node-canvas-with-twemoji-and-discord-emoji';
import { CanvasRenderingContext2D } from 'canvas';
import moment from 'moment';
import 'moment-duration-format';

/* eslint-disable eqeqeq */

export function progressBar(percent: number, length = 8) {
  let str = '';
  for (let i = 0; i < length; i++) { // eslint-disable-line no-plusplus
    if (i == Math.round(percent * length)) str += '\uD83D\uDD18';
    else str += '▬';
  }
  return str;
}

export function formatTime(time: number) {
  if (!time) return '00:00';
  const fmt = moment.duration(time).format('dd:hh:mm:ss');

  const chunk = fmt.split(':');
  if (chunk.length < 2) chunk.unshift('00');
  return chunk.join(':');
}

export function getVolumeIcon(volume: number) {
  if (volume == 0) return '\uD83D\uDD07';
  if (volume < 33) return '\uD83D\uDD08';
  if (volume < 67) return '\uD83D\uDD09';
  return '\uD83D\uDD0A';
}

export function playerEmbed(player: any, current: any) {
  return `${player.paused ? '\u23F8' : '\u25B6'} ${
    progressBar(player.position / current.info.length)
  }\`[${formatTime(player.position)}/${formatTime(current.info.length)}]\`${
    getVolumeIcon(player.volume)}`;
}

export function renderEmoji(ctx: CanvasRenderingContext2D, message: string, x: number, y: number) {
  return emoji.fillTextWithTwemoji(ctx, message, x, y);
}

export function getLines({ text, ctx, maxWidth }) {
  const lines = [];

  while (text.length) {
    let i;
    for (i = text.length; ctx.measureText(text.substr(0, i)).width > maxWidth; i -= 1);
    const result = text.substr(0, i);
    let j;
    if (i !== text.length) for (j = 0; result.indexOf(' ', j) !== -1; j = result.indexOf(' ', j) + 1);
    lines.push(result.substr(0, j || result.length));
    text = text.substr(lines[lines.length - 1].length, text.length);
  }

  return lines;
}
