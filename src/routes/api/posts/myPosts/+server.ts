import { env } from "$env/dynamic/private";
import type { RequestHandler } from "@sveltejs/kit";
import type { Post } from '$lib/types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const GET: RequestHandler = async ({ cookies, url }) => {

  const api_url: string | undefined = env.API_URL;
  const access_token = cookies.get('access_token');
  const offset = url.searchParams.get('offset') ?? '0';
  const limit = url.searchParams.get('limit') ?? '10';
  const myPosts_url = `${api_url}/posts/myPosts?offset=${offset}&limit=${limit}`;
  let fetchedPosts: { data: Array<Post> | null, status: number } = { data: null, status: 500 };

  if (!api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`)
    return new Response(JSON.stringify(fetchedPosts))
  }

  if (!access_token) {
    console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`)
    fetchedPosts.status = 401;
    return new Response(JSON.stringify(fetchedPosts))
  }

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  try {
    const response = await fetch(myPosts_url, options);
    fetchedPosts.status = response.status;
    if (response.ok) {
      fetchedPosts.data = await response.json();
      return new Response(JSON.stringify(fetchedPosts))
    }
    return new Response(JSON.stringify(fetchedPosts))
  } catch (error) {
    console.error(`Error(api): Error en [${__route}].\n\t- Error al intentar obtener "myPosts"\n\t- ${error}`)
    return new Response(JSON.stringify(fetchedPosts))
  }
}
