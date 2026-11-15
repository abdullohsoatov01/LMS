/**
 * Deterministic shuffle keyed by a string, so server and client render the same order
 * (no hydration mismatch) while the order still looks random to students.
 */
export function seededShuffle<T>(items: T[], key: string): T[] {
  let seed = 0;
  for (let i = 0; i < key.length; i++) seed = (Math.imul(31, seed) + key.charCodeAt(i)) | 0;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Indexes 0..n-1 shuffled, guaranteed not to be in the original order. */
export function shuffledIndexes(n: number, key: string) {
  const order = seededShuffle(
    Array.from({ length: n }, (_, i) => i),
    key,
  );
  if (n > 1 && order.every((v, i) => v === i)) order.push(order.shift()!);
  return order;
}
