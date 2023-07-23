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
  editProfile: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const email = form.get('email');
    const profile_photo = form.get('profile_photo') as File;
    const cover_photo = form.get('cover_photo') as File;
    const description = form.get('description');
    const personal_url = form.get('personal_url');
    const location = form.get('location');
    const birthday = form.get('birthday');

    if (!email) {
      return fail(400, { emailMissing: true });
    }

    const is_there_profile_photo = profile_photo?.size > 0 ? true : false;
    const is_there_cover_photo = cover_photo?.size > 0 ? true : false;
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const files_url = `${base_api_url}/files/`;
    const access_token = cookies.get('access_token');

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
      let response = await fetch(files_url, options);
      if (response.ok) {
        let img = await response.json();
        return img.url;
      } else {
        return '';
      }
    };
    let profile_photo_url: string = '';
    let cover_photo_url: string = '';
    if (is_there_profile_photo) {
      profile_photo_url = await image_url_request(profile_photo);
      console.log(profile_photo_url);
      cookies.set('profile_photo', profile_photo_url, {
        path: '/',
      });
    }
    if (is_there_cover_photo) {
      cover_photo_url = await image_url_request(cover_photo);
      console.log(cover_photo_url);
    }

    const body = {
      ...(email !== undefined ? { email } : {}),
      ...(is_there_profile_photo ? { profile_photo: profile_photo_url } : {}),
      ...(is_there_cover_photo ? { cover_photo: cover_photo_url } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(personal_url !== undefined ? { personal_url } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(birthday !== undefined ? { birthday } : {})
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
    if (response.ok) {
      throw redirect(303, '/settings');
    }
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
