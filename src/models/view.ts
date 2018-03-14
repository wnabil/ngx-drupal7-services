export interface ViewOptions {
  display_id: string,
  filters?: {[key: string]: any},
  args?: Array<string | number | boolean | string[] | number[] | boolean[]>,
  offset?: number,
  limit?: number,
  format_output?: 0 | 1,
  page?: number,
}
