export const idIncrementor = (array: any[]): number => {
  const ids = array.map(e => e.id);
  ids.sort();
  return 0;
}