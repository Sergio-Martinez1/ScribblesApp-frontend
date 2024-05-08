import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';
import type { Post, User } from "$lib/types";
import type { PageServerLoad } from "./$types";

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  let fetchedUser = { data: null, status: 500 };
  let fetchedUserPosts = { data: null, status: 500 };
  let user_response: Promise<{ data: User | null, status: number }> = Promise.resolve(fetchedUser);
  let user_posts_response: Promise<{ data: Array<Post> | null, status: number }> = Promise.resolve(fetchedUserPosts);

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        myUser: user_response,
        myPosts: user_posts_response
      }
    }
  }

  user_response = fetch(`${base_api_url}/users/${params.id}`)
    .then(async (response) => {
      fetchedUser.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedUser.data = data;
      }
      return fetchedUser;
    }).catch((error)=>{
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "user"\n\t- ${error}`)
      return fetchedUser;
    });
  user_posts_response = fetch(`${base_api_url}/posts/user/${params.id}`)
    .then(async (response) => {
      fetchedUserPosts.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedUserPosts.data = data;
      }
      return fetchedUserPosts;
    }).catch((error)=>{
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "user_posts"\n\t- ${error}`)
      return fetchedUserPosts;
    });

  return {
    streamed: {
      user: user_response,
      posts: user_posts_response
    }
  };
};
