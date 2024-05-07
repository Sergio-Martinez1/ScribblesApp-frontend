export interface TopTag {
  content: string
  count: number
}
export interface Post {
  id: number,
  content: string,
  thumbnail: string,
  publication_date: string,
  user_id: number,
  user: {
    id: number,
    username: string,
    profile_photo: string,
  }
  reactions: Array<{ id: number, user_id: number, post_id: number }>,
  tags: Array<{ content: string, post_id: number }>,
  num_comments: number
}
