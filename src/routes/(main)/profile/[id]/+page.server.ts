import type { PageServerLoad } from "./$types";
import { env } from '$env/dynamic/private';
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  if(!base_api_url) throw error(404, 'No api provided');
  
  const user_response = await fetch(`${base_api_url}/users/${params.id}`);
  const user_posts_response = await fetch(`${base_api_url}/posts/user/${params.id}`);
  if (user_response.ok && user_posts_response.ok) {
    return {
      user: user_response.json(),
      posts: user_posts_response.json()
    };
  }
};
