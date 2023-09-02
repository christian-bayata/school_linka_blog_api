export class EmailData {
  readonly from: string;
  readonly to: string | string[];
  readonly subject: string;
  readonly text?: string;
}
