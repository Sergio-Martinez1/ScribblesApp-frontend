import { error as svelteError, json, type RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const POST: RequestHandler = async ({ request, cookies }) => {
  const form = await request.formData();
  const profile_photo = form.get('profile_photo') as File;
  const cover_photo = form.get('cover_photo') as File;
  const is_there_profile_photo = profile_photo?.size > 0 ? true : false;
  const is_there_cover_photo = cover_photo?.size > 0 ? true : false;
  const base_api_url: string = env.API_URL;
  const update_url = `${base_api_url}/users/update`;
  const files_url = `${base_api_url}/files/`;
  const access_token = cookies.get('access_token');

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`)
    svelteError(500, { message: 'Server fail ' })
  }

  if (!access_token) {
    svelteError(401, { message: 'Not authenticated' })
  }

  let image_url_request = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${access_token}`
      }),
      body: formData
    };
    let response: Response;
    try {
      response = await fetch(files_url, options);
    } catch (error) {
      console.error(`Error(api): Error en [${__route}].\n\t- Error al intentar obtener la url de la imagen\n\t- ${error}`)
      svelteError(500, { message: 'Server fail ' })
    }
    if (response.ok) {
      let img = await response.json();
      return { url: img.url, status: response.status };
    } else if (response.status === 401) {
      svelteError(401, { message: 'Not authenticated' })
    } else {
      svelteError(500, { message: 'Server fail ' })
    }
  };

  let profile_photo_url: { url: string, status: number } = { url: '', status: 200 };
  let cover_photo_url: { url: string, status: number } = { url: '', status: 200 };

  if (is_there_profile_photo) {
    profile_photo_url = await image_url_request(profile_photo);
    if (profile_photo_url.status === 401) {
      svelteError(401, { message: 'Not authenticated' })
    } else if (profile_photo_url.status !== 201) {
      svelteError(500, { message: 'Server fail ' })
    }
  }
  if (is_there_cover_photo) {
    cover_photo_url = await image_url_request(cover_photo);
    if (cover_photo_url.status === 401) {
      svelteError(401, { message: 'Not authenticated' })
    } else if (cover_photo_url.status !== 201) {
      svelteError(500, { message: 'Server fail ' })
    }
  }

  const body = {
    ...(is_there_profile_photo ? { profile_photo: profile_photo_url.url } : {}),
    ...(is_there_cover_photo ? { cover_photo: cover_photo_url.url } : {}),
  };

  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  let response: Response;

  try {
    response = await fetch(update_url, options);
  } catch (error) {
    console.error(`Error(api): Error en [${__route}].\n\t- Error al intentar actualizar los datos del usuario\n\t- ${error}`)
    svelteError(500, { message: 'Server fail ' })
  }

  if (response.ok) {
    return json({
      status: 200,
      body: 'File upload sucessfully'
    });
  } else if (response.status === 401) {
    svelteError(401, { message: 'Not authenticated' })
  } else {
    svelteError(500, { message: 'Server fail ' })
  }
};
