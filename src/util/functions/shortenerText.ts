export function shortenerText(text: string, maxLen = 1024): string {
  return (text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text);
}
