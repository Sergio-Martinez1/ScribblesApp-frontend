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
        user: response.json()
      };
    }
  }
};

export const actions: Actions = {
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
        method: 'POST',
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
  editProfile: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const username = form.get('username') as File;
    const email = form.get('email') as File;
    const profile_photo = form.get('profile_photo') as File;
    const cover_photo = form.get('cover_photo') as File;
    const description = form.get('description');
    const personal_url = form.get('personal_url');
    const location = form.get('location');
    const birthday = form.get('birthday');

    
    if (!username) {
      return fail(400, { usernameMissing: true, email });
    }
    if (!email) {
      return fail(400, { emailMissing: true, username});
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
    }
    if (is_there_cover_photo) {
      cover_photo_url = await image_url_request(cover_photo);
      console.log(cover_photo_url);
    }

    const body = {
        username,
        email,
        ...(is_there_profile_photo ? { profile_photo: profile_photo_url } : {}),
        ...(is_there_cover_photo ? { cover_photo: cover_photo_url } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(personal_url !== undefined ? { personal_url } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(birthday !== undefined ? { birthday } : {}),
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
  }
};
