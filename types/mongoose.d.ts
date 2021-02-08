declare module "mongoose" {
  export interface Model<T extends Document> {
    /* With string that returns a Promise */
    fuzzySearch(query: string): Query<Array<T>, T>;

    /* With additional options that returns a Promise */
    fuzzySearch({
      query: string,
      prefixOnly: boolean,
      minSize: number,
    }): Query<Array<T>, T>;

    /* With additional queries that returns a Promise */
    fuzzySearch(query: string, filter: FilterQuery<T>): Query<Array<T>, T>;

    /* With string and a callback */
    fuzzySearch(
      query: string,
      callback?: (err: any, docs: T[]) => void
    ): Query<Array<T>, T>;

    /* With additional queries and callback */
    fuzzySearch(
      query: string,
      filter: FilterQuery<T>,
      callback?: (err: any, docs: T[]) => void
    ): Query<Array<T>, T>;
  }
}
