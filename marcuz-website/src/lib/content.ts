import copy from '@/content/copy.json';

export function getContent(key: string): any {
  const keys = key.split('.');
  let value: any = copy;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k as keyof typeof value];
    } else {
      return undefined;
    }
  }

  return value;
}

export const content = copy;
