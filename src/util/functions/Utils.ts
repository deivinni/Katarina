/* eslint-disable eqeqeq */

export function paginate(items: string[], page = 1, pageLength = 10) {
  const maxPage = Math.ceil(items.length / pageLength);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  const startIndex = (page - 1) * pageLength;

  return {
    items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
    page,
    maxPage,
    pageLength,
  };
}

export function progressBar(percent: number, length = 8) {
  let str = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    if (i == Math.round(percent * length)) str += '\uD83D\uDD18';
    else str += '▬';
  }
  return str;
}

export function formatTime(duration: number) {
  const minutes: number = Math.floor(duration / 60000);
  const seconds: number = Number(((duration % 60000) / 1000).toFixed(0));
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function getVolumeIcon(volume) {
  if (volume == 0) return '\uD83D\uDD07';
  if (volume < 33) return '\uD83D\uDD08';
  if (volume < 67) return '\uD83D\uDD09';
  return '\uD83D\uDD0A';
}

export function playerEmbed(player, current) {
  return `${player.paused ? '\u23F8' : '\u25B6'} ${
    progressBar(player.position / current.info.length)
  }\`[${formatTime(player.position)}/${formatTime(current.info.length)}]\`${
    getVolumeIcon(player.volume)}`;
}
