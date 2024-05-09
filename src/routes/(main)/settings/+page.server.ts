import { fail, type Actions, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';
import type { PageServerLoad } from './$types';
import type { MyUser } from '$lib/types';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const base_api_url: string = env.API_URL;
  const url = `${base_api_url}/users/myUser`;
  let fetchedMyUser = { data: null, status: 500 };
  let myUser_response: Promise<{ data: MyUser | null, status: number }> = Promise.resolve(fetchedMyUser);

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        myUser: myUser_response,
      }
    }
  }

  const access_token = cookies.get('access_token');
  if (!access_token) {
    console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
    throw redirect(303, "/login");
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };

  myUser_response = fetch(url, options)
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

  return {
    streamed: {
      myUser: myUser_response,
    }
  }

};

export const actions: Actions = {
  editDescription: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const description = form.get('description');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });
    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const body = {
      ...(description ? { description } : { description: '' }),
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
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "editDescription"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login")
    else return fail(response.status, { serverFail: true });

  },
  editWebSite: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const personal_url = form.get('personal_url');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });
    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const body = {
      ...(personal_url ? { personal_url } : { personal_url: '' }),
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
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "editWebSite"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login")
    else return fail(response.status, { serverFail: true });

  },
  editLocation: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const location = form.get('location');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });
    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const body = {
      ...(location ? { location } : { location: '' }),
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
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "editLocation"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login")
    else return fail(response.status, { serverFail: true });

  },
  editBirthday: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const birthday = form.get('birthday');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });
    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const body = {
      ...(birthday ? { birthday } : { birthday: '' }),
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
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "editBirthday"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login");
    else return fail(response.status, { serverFail: true });
  },
  changeUsername: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');
    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/username`;
    const access_token = cookies.get('access_token');

    if (!username) {
      return fail(400, { usernameMissing: true });
    }

    if (!password) {
      return fail(400, { passwordMissing: true });
    }

    if (!base_api_url) return fail(500, { serverFail: true });

    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const body = {
      username,
      password
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
      response = await fetch(url, options);
    } catch (error) {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "changeUsername"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) {

      const body = new URLSearchParams();
      body.append('username', username.toString());
      body.append('password', password.toString());
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      };

      const signin_url = `${base_api_url}/users/signin`;
      let signin_response: Response;

      try {
        signin_response = await fetch(signin_url, options);
      } catch (error) {
        console.error(`Error: Error en [${__route}].\n\t- Error al intentar "signin"\n\t- ${error}`)
        return fail(500, { serverFail: true });
      }

      if (signin_response.ok) {
        const responseJSON = await signin_response.json();
        cookies.set('access_token', responseJSON.access_token, {
          path: '/'
        });
        cookies.set('username', responseJSON.username, {
          path: '/'
        });
        return;
      } else if (signin_response.status == 401) {
        throw redirect(303, "/login")
      } else {
        return fail(response.status, { serverFail: true });
      }

    } else if (response.status === 400) {
      return fail(400, { usernameExists: true });
    } else if (response.status === 404) {
      return fail(404, { usernameNotFound: true });
    } else if (response.status === 401) {
      return fail(401, { wrongPassword: true });
    } else {
      return fail(response.status, { serverFail: true });
    }
  },
  changePassword: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const password = form.get('password');
    const newPassword = form.get('new_password');
    const confirm = form.get('confirm');
    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/password`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });

    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    if (!password) {
      return fail(400, { passwordMissing: true });
    }
    if (!newPassword) {
      return fail(400, { newPasswordMissing: true });
    }
    if (!confirm) {
      return fail(400, { confirmMissing: true });
    }
    if (newPassword !== confirm) {
      return fail(400, { passwordConfirm: true });
    }

    const body = {
      password: password,
      new_password: newPassword
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
      response = await fetch(url, options);
    } catch (error) {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "changePassword"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) {
      return;
    } else if (response.status === 401) {
      throw redirect(303, "/login")
    } else if (response.status === 403) {
      return fail(response.status, { incorrectPassword: true });
    } else {
      return fail(response.status, { serverFail: true });
    }
  },
  deleteAccount: async ({ fetch, cookies }) => {
    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/`;
    const access_token = cookies.get('access_token');

    if (!base_api_url) return fail(500, { serverFail: true });

    if (!access_token) {
      console.error(`Error: Error en [${__route}].\n\t- El usuario no ha iniciado sesion`);
      throw redirect(303, "/login");
    }

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };

    let response: Response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar "deleteAccount"\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }

    if (response.ok) {
      cookies.delete('access_token', { path: '/' });
      cookies.delete('username', { path: '/' });
      cookies.delete('profile_photo', { path: '/' });
      cookies.delete('user_id', { path: '/' });
      cookies.delete('refresh_token', { path: '/' });
      throw redirect(303, '/home');
    } else if (response.status == 401) {
      throw redirect(303, "/login");
    } else return fail(response.status, { serverFail: true });

  }
};
