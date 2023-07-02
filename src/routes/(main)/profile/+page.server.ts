import { env } from '$env/dynamic/private';
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {

  const base_api_url: string | undefined = env.API_URL;

  if (!base_api_url) throw error(404, 'No api provided');

  const access_token = cookies.get('access_token');
  const data: { myUser: any; myPosts: any; } = { myUser: null, myPosts: null };

  if (access_token) {

    const myUser_url = `${base_api_url}/users/myUser`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    };
    const myUser_response = await fetch(myUser_url, options);

    if (myUser_response.ok) {

      data.myUser = myUser_response.json();
      const myPosts_url = `${base_api_url}/posts/myPosts`;
      const myPosts_response = await fetch(myPosts_url, options);

      if (myPosts_response.ok) {

        data.myPosts = myPosts_response.json();

      }
      return {
        myUser: data.myUser,
        myPosts: data.myPosts
      }
    }
  }
};
