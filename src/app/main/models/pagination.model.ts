export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
  from: number;
  to: number;
}
