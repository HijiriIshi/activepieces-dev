export function createHashOptions(prefix: string) {
  return Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // 65 = 'A'
    const label = `${prefix}${letter}`;
    return { label, value: label };
  })
}