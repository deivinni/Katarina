import axios from 'axios';

export async function Translate(text: string, { from, to }: { from?: string, to?: string }): Promise<TranslateResponse> {
  const response = await axios.get('https://translate.googleapis.com/translate_a/single?', {
    params: {
      client: 'gtx',
      dt: 't',
      sl: from || 'auto',
      tl: to,
      q: text,
    },
  });

  return {
    translated: response.data[0][0][0],
    original: response.data[0][0][1],
    from: response.data[2],
    to,
    url: `https://translate.google.com/#view=home&op=translate&sl=auto&tl=${to}&text=${encodeURIComponent(text)}`,
  };
}

interface TranslateResponse {
  translated: string,
  original: string,
  from: string,
  to: string,
  url: string;
}
