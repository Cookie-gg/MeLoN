export function releaseSort<T>(data: T[]) {
  return data.sort(
    (a: T & { releaseDate: number }, b: T & { releaseDate: number }) => {
      if (a.releaseDate < b.releaseDate) return 1;
      if (a.releaseDate > b.releaseDate) return -1;
      return 0;
    },
  );
}
