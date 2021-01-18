import axios from 'axios';
import * as endpoints from '../assets/endpoints';

export function getWebImage(api: string, { type, endpoint }: { type: string; endpoint?: string}): Promise<WebImageResponse> {
  const request = async (url: string) => (await axios.get(url)).data;
  const links: string[] = [
    `https://nekos.life/api/v2/${endpoints.nekos[type][endpoint]}`,
    `https://waifu.pics/api/${type}/${endpoint}`,
  ];

  switch (api) {
    case 'nekos':
      return request(links[0]);
    case 'waifu':
      return request(links[1]);
    case 'random':
    default:
      return request(links[Math.floor(Math.random() * links.length)]);
  }
}

interface WebImageResponse {
  url?: string,
  message?: string
}
