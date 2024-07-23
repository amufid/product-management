export type Paging = {
   size: number;
   currentPage: number;
   totalPages: number;
}

export type Pageable<T> = {
   message: string;
   data: Array<T>;
   paging: Paging;
}
