import { env } from "$env/dynamic/private";
import { fileURLToPath } from 'url';
import type { TopTag, Post } from '$lib/types';
import type { PageServerLoad } from "./$types";

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

//REVISAR PARA MOSTRAR POSTS PERSONALES Y PUBLICOS
export const load: PageServerLoad = async ({ fetch }) => {

  const base_api_url: string | undefined = env.API_URL;
  let fetchedTags = { data: null, status: 500 };
  let top_tags_response: Promise<{ data: Array<TopTag> | null, status: number }> = Promise.resolve(fetchedTags);

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        top_tags: top_tags_response
      }
    }
  }

  top_tags_response = fetch(`${base_api_url}/tags/top`)
    .then(async (response) => {
      fetchedTags.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedTags.data = data;
      }
      return fetchedTags;
    }).catch((error) => {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "Top tags"\n\t- ${error}`)
      return fetchedTags;
    })

  return {
    streamed: {
      top_tags: top_tags_response
    }
  }

};
