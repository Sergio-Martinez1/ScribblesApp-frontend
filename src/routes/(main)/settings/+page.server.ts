import { fail, type Actions, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const base_api_url: string = env.API_URL;
  const url = `${base_api_url}/users/myUser`;
  const access_token = cookies.get('access_token');
  
  if (access_token) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(url, options);
    
    if (response.ok) {
      return {
        streamed: {
          user: response.json()
        }
      };
    } else if (response.status === 401) throw redirect(303, "/login");
    
  } else {
    throw redirect(303, "/login")
  }
};

export const actions: Actions = {
  editDescription: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const description = form.get('description');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    const body = {
      ...(description ? { description } : {description: ''}),
    };
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(update_url, options);
  },
  editWebSite: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const personal_url = form.get('personal_url');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');
    console.log(personal_url)

    const body = {
      ...(personal_url ? { personal_url } : {personal_url: ''}),
    };
    console.log(body)
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(update_url, options);
  },
  editLocation: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const location = form.get('location');
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    const body = {
      ...(location ? { location } : {location: ''}),
    };
    console.log(body)
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(update_url, options);
  },
  editBirthday: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const birthday = form.get('birthday');
    console.log(birthday)
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');

    const body = {
      ...(birthday ? { birthday } : {birthday: ''}),
    };
    console.log(body)
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(update_url, options);
  },
  changeUsername: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');

    if (!username) {
      return fail(400, { usernameMissing: true });
    }

    if (!password) {
      return fail(400, { passwordMissing: true });
    }

    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/username`;
    const access_token = cookies.get('access_token');
    if (access_token) {
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
      const response = await fetch(url, options);
      if (response.status === 400) {
        return fail(400, { usernameExists: true });
      } else if (response.status === 404) {
        return fail(404, { usernameNotFound: true });
      } else if (response.status === 401) {
        return fail(401, { wrongPassword: true });
      } else if (response.ok) {
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
        const url = `${base_api_url}/users/signin`;
        const response = await fetch(url, options);
        if (response.ok) {
          const responseJSON = await response.json();
          cookies.set('access_token', responseJSON.access_token, {
            path: '/'
          });
          cookies.set('username', responseJSON.username, {
            path: '/'
          });
          throw redirect(303, '/settings');
        }
      }
    }
  },
  changePassword: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const password = form.get('password');
    const newPassword = form.get('new_password');
    const confirm = form.get('confirm');

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

    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/passsword`;
    const access_token = cookies.get('access_token');
    if (access_token) {
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
      const response = await fetch(url, options);
      if (response.ok) {
        throw redirect(303, '/settings');
      }
    }
  },
  deleteAccount: async ({ fetch, cookies }) => {
    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/`;
    const access_token = cookies.get('access_token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(url, options);
    if (response.ok) {
      cookies.delete('access_token', { path: '/' });
      cookies.delete('username', { path: '/' });
      cookies.delete('profile_photo', { path: '/' });
      cookies.delete('user_id', { path: '/' });
      cookies.delete('refresh_token', { path: '/' });
      throw redirect(303, '/home');
    }
  }
};
