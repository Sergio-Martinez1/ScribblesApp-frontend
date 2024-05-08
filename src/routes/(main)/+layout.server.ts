import type { LayoutServerLoad } from "../$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { fileURLToPath } from 'url';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {

  const __filename = fileURLToPath(import.meta.url);
  const __route = __filename.slice(__filename.indexOf('src'));

  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`)
    return { myReactions: null }
  }

  const access_token = cookies.get('access_token');

  const url = `${base_api_url}/reactions/myReactions`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  try {
    const my_reactions_response = await fetch(url, options);
    if (my_reactions_response.ok) {
      return {
        my_reactions: my_reactions_response.json()
      }
    } else if (my_reactions_response.status == 401) {
      return {
        my_reactions: null
      }
    } else {
      throw error(my_reactions_response.status, my_reactions_response.statusText);
    }
  } catch (error) {
    console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "My reactions"\n\t- ${error}`)
  }

  return {
    my_reactions: null
  }
}
