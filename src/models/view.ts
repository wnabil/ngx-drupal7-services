export interface ViewOptions {
  filters?: {[key: string]: string | number | boolean},
  display_id?: string,
  args?: Array<string | number | boolean>,
  offset?: number,
  limit?: number,
  format_output?: 0 | 1,
}
