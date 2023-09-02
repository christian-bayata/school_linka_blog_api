export interface PropDataInput {
  [props: string]: any;
}

export class ErrorResponse {
  readonly message: string;
  readonly status: number;
}
