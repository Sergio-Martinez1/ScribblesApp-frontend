import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { TopTag, Post } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  let fetchedPosts = { data: null, status: 500 };
  let fetchedTags = { data: null, status: 500 };
  let posts_response: Promise<{ data: Array<Post> | null, status: number }> = Promise.resolve(fetchedPosts);
  let top_tags_response: Promise<{ data: Array<TopTag> | null, status: number }> = Promise.resolve(fetchedTags);

  if (!base_api_url) throw error(404, 'No api provided');
  if (!base_api_url) {
    console.error(`Error: Error en [/routes/(main)/home/[tag]/+page.server.ts].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        posts: posts_response,
        top_tags: top_tags_response
      }
    };
  }

  posts_response = fetch(`${base_api_url}/posts/tags/${params.tag}`)
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        fetchedPosts.data = data;
      }
      return fetchedTags;
    }).catch((error) => {
      console.error(`Error: Error en [/routes/(main)/home/[tag]/+page.server.ts].\n\t- Error al intentar obtener posts por tag\n\t- ${error}`)
      return fetchedTags;
    })

  top_tags_response = fetch(`${base_api_url}/tags/top`)
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        fetchedTags.data = data;
      }
      return fetchedTags;
    }).catch((error) => {
      console.error(`Error: Error en [/routes/(main)/home/[tag]/+page.server.ts].\n\t- Error al intentar obtener "Top tags"\n\t- ${error}`)
      return fetchedTags;
    });

  return {
    streamed: {
      posts: posts_response,
      top_tags: top_tags_response
    }
  };
};
