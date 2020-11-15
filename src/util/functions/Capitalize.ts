export function capitalize(text: string): string {
  return text
    .toLowerCase()
    .replace(
      /^(\b\w)/gi,
      (char) => char.toUpperCase(),
    );
}
