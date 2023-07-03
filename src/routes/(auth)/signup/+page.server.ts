import { fail, type Actions, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
  signup: async ({ request, fetch }) => {
    const form = await request.formData();
    const username = form.get('username');
    const email = form.get('email');
    const password = form.get('password');
    const confirm = form.get('confirm');
    if (!username) {
      return fail(400, { usernameMissing: true, email });
    }
    if (!email) {
      return fail(400, { emailMissing: true, username });
    }
    if (!password) {
      return fail(400, { passwordMissing: true, username, email });
    }
    if (!confirm) {
      return fail(400, { passwordConfirmMissing: true, username, email });
    }
    if (password !== confirm) {
      return fail(400, { passwordConfirm: true, username, email });
    }

    const base_api_url: string = env.API_URL;
    const url = `${base_api_url}/users/signup`;

    const body = {
      username,
      email,
      password
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch(url, options);
    if (response.ok) {
      throw redirect(303, '/login');
    } else if (response.status === 400) {
      const res = await response.json();
      const detail = res.detail;
      if (detail === 'Username already exist'){
        return fail(400, { usernameExists: true, email });
      } else {
        return fail(400, { emailExists: true, username });
      }
    }
  }
};
