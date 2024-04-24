import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {

  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) console.error('Error: No se encontro la url de la api - [/routes/+layout.server.ts]');

  const access_token = cookies.get('access_token');
  if (!access_token) {
    console.error('Error: El access_token ha expirado')
    return { plainMyUser: null };
  }

  const options = {
    method: "get",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };
  try {
    const response = await fetch(`${base_api_url}/users/plainMyUser`, options);
    if (response.ok) {
      return {
        plainMyUser: await response.json()
      }
    } else {
      throw error(response.status, response.statusText);
    }
  } catch (error) {
    console.error(`Error: en [/routes/+layout.server.ts].\n\t- Error al intentar obtener "Mi usuario"\n\t- ${error}`)
  }
  return {
    plainMyUser: null
  };
};
