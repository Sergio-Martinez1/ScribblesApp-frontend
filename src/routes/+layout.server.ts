import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {

  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) throw error(404, 'No api provided');
  
  const access_token = cookies.get('access_token');
  if (!access_token) return { plainMyUser: null };

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };
  const response = await fetch(`${base_api_url}/users/plainMyUser`, options);
  if (response.ok) {
    return {
      plainMyUser: response.json()
    }
  } else if (response.status === 401) {
    return {
      plainMyUser: null
    };
  } 
};
