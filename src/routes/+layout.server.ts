import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const access_token = cookies.get('access_token');
  if (access_token) {
    const username = cookies.get('username') as string;
    let id = cookies.get('id') as string;
    return {
      username,
      id
    };
  }
};
