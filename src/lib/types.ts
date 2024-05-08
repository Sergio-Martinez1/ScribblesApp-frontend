export interface TopTag {
  content: string
  count: number
}
export interface Post {
  id: number,
  content: string | null,
  thumbnail: string | null,
  publication_date: string,
  user_id: number,
  user: {
    id: number,
    username: string,
    profile_photo: string | null,
  }
  reactions: Array<{ id: number, user_id: number, post_id: number }> | null,
  tags: Array<{ content: string, post_id: number }> | null,
  num_comments: number | null
}
export interface Comment {
  id: number,
  content: string,
  creation_date: string,
  post_id: number,
  user_id: number,
  user: {
    id: number,
    username: string,
    profile_photo: string | null
  }
}
export interface MyUser {
  username: string,
  email: string,
  creation_date: string,
  profile_photo: string | null,
  cover_photo: string | null,
  description: string | null,
  personal_url: string | null,
  location: string | null,
  birthday: string | null,
  prohibited_posts: Array<number> | null
}
export interface User {
  username: string,
  creation_date: string,
  profile_photo: string | null,
  cover_photo: string | null,
  description: string | null,
  personal_url: string | null,
  location: string | null,
  birthday: string | null,
}
