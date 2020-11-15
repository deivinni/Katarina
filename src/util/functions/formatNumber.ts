import Intl from 'intl';

export function formatNumber(number: number, lang?: string): string {
  return (
    new Intl
      .NumberFormat(lang || 'pt-br')
      .format(number)
  );
}
