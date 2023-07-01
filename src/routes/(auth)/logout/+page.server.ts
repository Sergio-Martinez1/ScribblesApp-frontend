import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete('access_token', {path: '/'});
  cookies.delete('username', {path: '/'});
  cookies.delete('profile_photo', {path: '/'});
  cookies.delete('user_id', {path: '/'});
  cookies.delete('refresh_token', {path: '/'});
  throw redirect(303, "/home");
};
