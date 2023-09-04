export class CreatePostDto {
  readonly title: string;
  creator: string;
  readonly content: string;
}

export class CreateEngagementDto {
  readonly post_id: number;
  readonly flag: string;
  readonly comment?: string;
  engager: number;
}
