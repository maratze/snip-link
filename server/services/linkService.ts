import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7);

export async function shortenUrl(originalUrl: string, customAlias?: string): Promise<string> {
  if (customAlias) {
    // Check if the custom alias is valid (e.g., only alphanumeric characters)
    if (!/^[a-zA-Z0-9]+$/.test(customAlias)) {
      throw new Error('Invalid custom alias. Only alphanumeric characters are allowed.');
    }
    return customAlias;
  }
  return nanoid();
}