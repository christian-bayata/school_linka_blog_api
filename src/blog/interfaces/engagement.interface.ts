export interface EngagementInterface {
  type: string;
  post_id: number;
  flag: string;
  comment?: string;
  likedAt?: Date;
  viewedAt?: Date;
  commentedAt?: Date;
}
