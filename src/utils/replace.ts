export default function replaceAll(target: string, ...args: string[]): string {
  args.forEach((arg) => {
    do {
      target = target.replace(arg, '');
    } while (target.includes(arg));
  });
  return target;
}
