import { env } from "$env/dynamic/private";
import { error, type RequestHandler } from "@sveltejs/kit";
import { fileURLToPath } from 'url';
import type { Post } from '$lib/types';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const GET: RequestHandler = async ({ cookies, url }) => {

  const api_url: string | undefined = env.API_URL;
  const access_token = cookies.get('access_token');
  const offset = url.searchParams.get('offset') ?? '0';
  const limit = url.searchParams.get('limit') ?? '10';
  const public_posts_url = `${api_url}/posts/pagination?offset=${offset}&limit=${limit}`;
  const home_posts_url = `${api_url}/posts/home?offset=${offset}&limit=${limit}`;
  let fetchedPosts: { data: Array<Post> | null, status: number } = { data: null, status: 500 };

  if (!api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`)
    return new Response(JSON.stringify(fetchedPosts))
  }

  if (!access_token) {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    };
    try {
      const response = await fetch(public_posts_url, options);
      fetchedPosts.status = response.status;
      if (response.ok) {
        fetchedPosts.data = await response.json();
        return new Response(JSON.stringify(fetchedPosts))
      }
      error(response.status, response.statusText);
    } catch (error) {
      console.error(`Error(api): Error en [${__route}].\n\t- Error al intentar obtener posts publicos\n\t- ${error}`)
      return new Response(JSON.stringify(fetchedPosts))
    }
  }

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  try {
    const response = await fetch(home_posts_url, options);
    fetchedPosts.status = response.status;
    if (response.ok) {
      fetchedPosts.data = await response.json();
      return new Response(JSON.stringify(fetchedPosts))
    } else if (response.status == 401) {
      const public_posts_response = await fetch(public_posts_url);
      fetchedPosts.status = public_posts_response.status;
      if (public_posts_response.ok) {
        fetchedPosts.data = await public_posts_response.json();
        return new Response(JSON.stringify(fetchedPosts))
      }
      error(public_posts_response.status, response.statusText);
    }
    error(response.status, response.statusText);
  } catch (error) {
    console.error(`Error(api): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener posts publicos\n\t- ${error}`)
    return new Response(JSON.stringify(fetchedPosts))
  }
}
