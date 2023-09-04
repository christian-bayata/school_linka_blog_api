export interface EngagementInterface {
  type: string;
  post_id: number;
  flag: string;
  engager: number;
  comment?: string;
  likedAt?: Date;
  viewedAt?: Date;
  commentedAt?: Date;
}
