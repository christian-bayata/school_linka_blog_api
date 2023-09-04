export interface AdditionalQuery {
  where?: { [props: string]: any };
  attributes?: string[];
  group?: string[];
  include?: object[];
  order?: any;
  limit?: number;
  offset?: number;
  page?: number;
}
