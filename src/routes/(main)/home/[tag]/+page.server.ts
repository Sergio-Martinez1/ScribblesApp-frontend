import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) throw error(404, 'No api provided');

  const posts_response = await fetch(`${base_api_url}/posts/tags/${params.tag}`);
  const top_tags_response = await fetch(`${base_api_url}/tags/top`);

  if (posts_response.ok && top_tags_response.ok) {
    return {
      posts: posts_response.json(),
      top_tags: top_tags_response.json()
    };
  }
};
