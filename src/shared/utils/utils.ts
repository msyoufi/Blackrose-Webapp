export function sortByKey<T>(
  arr: T[],
  key: keyof T,
  reversed: boolean = false
): T[] {
  if (!arr.length)
    return [];

  const valueType = typeof arr[0][key];

  if (valueType === 'string') {
    return reversed
      ? arr.slice().sort((a, b) => (<string>b[key]).localeCompare(<string>a[key]))
      : arr.slice().sort((a, b) => (<string>a[key]).localeCompare(<string>b[key]));
  }

  if (valueType === 'number') {
    return reversed
      ? arr.slice().sort((a, b) => <number>b[key] - <number>a[key])
      : arr.slice().sort((a, b) => <number>a[key] - <number>b[key]);
  }

  return arr;
}

export function matchString(str1: string, str2: string): boolean {
  return str1.toLowerCase().includes(str2.toLowerCase());
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function formatCurrency(value: number): string {
  return value >= 1000
    ? `${(value / 1000).toFixed(2)}M`
    : `${value}K`;
}