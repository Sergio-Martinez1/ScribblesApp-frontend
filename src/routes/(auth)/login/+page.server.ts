import { fail, type Actions, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
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
		const url = `${base_api_url}/users/signin`;
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
		const response = await fetch(url, options);
		if (response.ok) {
			const responseJSON = await response.json();
      cookies.set('access_token', responseJSON.access_token, {
        path: '/',
      });
      cookies.set('id', responseJSON.user_id, {
        path: '/',
      });
      cookies.set('username', responseJSON.username, {
        path: '/',
      });
      cookies.set('profile_photo', responseJSON.profile_photo, {
        path: '/',
      });
      throw redirect(303, "/home");
    } else if (response.status === 404) {
        return fail(400, { usernameDontExists: true});
    } else if (response.status === 400) {
        return fail(400, { wrongPassword: true, username });
    }
	}
};
