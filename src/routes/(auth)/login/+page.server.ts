import { fail, type Actions, redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';

export const actions: Actions = {
  login: async ({ request, fetch, cookies }) => {

    const __filename = fileURLToPath(import.meta.url);
    const __route = __filename.slice(__filename.indexOf('src'));

    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');

    if (!username) {
      return fail(400, { usernameMissing: true });
    }
    if (!password) {
      return fail(400, { passwordMissing: true, username });
    }

    const base_api_url: string = env.API_URL;
    if (!base_api_url) {
      console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }

    const url = `${base_api_url}/users/signin`;
    const body = new URLSearchParams;
    body.append('username', username.toString());
    body.append('password', password.toString());

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const responseJSON = await response.json();
        cookies.set('access_token', responseJSON.access_token, {
          path: '/',
        });
      } else if (response.status === 404) {
        return fail(400, { usernameDontExists: true });
      } else if (response.status === 400) {
        return fail(400, { wrongPassword: true, username });
      } else {
        throw error(response.status, response.statusText);
      }
    } catch (error) {
      console.error(`Error: Error en [${__route}].\n\t- Error en el servidor al intentar iniciar sesion\n\t- ${error}`);
      return fail(500, { serverFail: true });
    }

    throw redirect(303, "/home");
  }
};
