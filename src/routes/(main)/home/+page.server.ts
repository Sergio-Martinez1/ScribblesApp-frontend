import { type Actions, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch }) => {
  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) throw error(404, 'No api provided');

  const posts_response = await fetch(`${base_api_url}/posts/pagination?limit=20&offset=0`);
  const top_tags_response = await fetch(`${base_api_url}/tags/top`);

  if (posts_response.ok && top_tags_response.ok) {
    return {
      posts: posts_response.json(),
      top_tags: top_tags_response.json()
    };
  }
};

export const actions: Actions = {
  toogle_reaction: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const state_on = form.get('state_on');
    if (!post_id) {
      return fail(400, { postIdMissing: true });
    }
    if (!state_on) {
      return fail(400, { stateMissing: true });
    }
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, "/login");
    const base_api_url: string = env.API_URL;
    if (state_on === 'true') {
      const url = `${base_api_url}/reactions/`;
      const body = {
        "post_id": Number(post_id)
      }
      const options = {
        method: 'POST',
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      };
      const response = await fetch(url, options);
      if (response.ok) return;
    } else if (state_on === 'false') {
      const url = `${base_api_url}/reactions/${post_id}`;
      const options = {
        method: 'DELETE',
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        }
      };
      const response = await fetch(url, options);
      if (response.ok) return;
    }
  }
}
