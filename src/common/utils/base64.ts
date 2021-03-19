const base64regex = /^(\s*data:[a-z]+\/[a-z]+;base64),([a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$)/i;

export function isBase64(input: string): boolean {
  return base64regex.test(input);
}

export function removeDataUrlDeclaration(input: string): string {
  const [, , data] = input.match(base64regex);
  return data;
}
