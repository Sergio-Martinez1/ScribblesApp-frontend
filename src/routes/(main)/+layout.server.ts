import type { LayoutServerLoad } from "../$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) console.error('Error: No se encontro la url de la api - [/routes/+layout.server.ts]');

  const access_token = cookies.get('access_token');
  if (access_token) {

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
      } else {
        throw error(my_reactions_response.status, my_reactions_response.statusText);
      }
    } catch (error) {
      console.error('Error: Error al intentar conectarse con la api - [/routes/(main)/+layout.server.ts]')
    }
  }
  return {
    my_reactions: null
  }
}
