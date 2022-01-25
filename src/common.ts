export function releaseSort<T>(data: T[]) {
  return data.sort((a: T & { releaseDate: number }, b: T & { releaseDate: number }) => {
    if (a.releaseDate < b.releaseDate) return 1;
    if (a.releaseDate > b.releaseDate) return -1;
    return 0;
  });
}

export function topicSort<T>(data: T & { topics: string[] }) {
  data.topics = data.topics.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
  return data;
}
