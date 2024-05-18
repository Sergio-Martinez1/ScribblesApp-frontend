import { env } from '$env/dynamic/private';
import { redirect } from "@sveltejs/kit";
import { fileURLToPath } from 'url';
import type { PageServerLoad } from './$types';
import type { Post, MyUser } from '$lib/types';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const load: PageServerLoad = async ({ fetch, cookies }) => {

  const base_api_url: string | undefined = env.API_URL;
  let fetchedMyUser = { data: null, status: 500 };
  let fetchedMyPosts = { data: null, status: 500 };
  let myUser_response: Promise<{ data: MyUser | null, status: number }> = Promise.resolve(fetchedMyUser);
  let myPosts_response: Promise<{ data: Array<Post> | null, status: number }> = Promise.resolve(fetchedMyPosts);

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        myUser: myUser_response,
        myPosts: myPosts_response
      }
    }
  }

  const access_token = cookies.get('access_token');
  if (!access_token) {
    console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
    redirect(303, "/login");
  }

  const verify_token_options = {
    method: "get",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  let response: Response;

  try {
    response = await fetch(`${base_api_url}/users/plainMyUser`, verify_token_options);
  } catch (error) {
    console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "Mi usuario"\n\t- ${error}`);
    redirect(303, "/login");
  }

  if (!response.ok) {
    redirect(303, "/login");
  }

  const myUser_url = `${base_api_url}/users/myUser`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  myUser_response = fetch(myUser_url, options)
    .then(async (response) => {
      fetchedMyUser.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedMyUser.data = data;
      }
      return fetchedMyUser;
    }).catch((error) => {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "myUser"\n\t- ${error}`)
      return fetchedMyUser;
    });

  const myPosts_url = `${base_api_url}/posts/myPosts`;

  myPosts_response = fetch(myPosts_url, options)
    .then(async (response) => {
      fetchedMyPosts.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedMyPosts.data = data;
      }
      return fetchedMyPosts;
    }).catch((error) => {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "myPosts"\n\t- ${error}`)
      return fetchedMyPosts;
    });

  return {
    streamed: {
      myUser: myUser_response,
      myPosts: myPosts_response
    }
  }

};
