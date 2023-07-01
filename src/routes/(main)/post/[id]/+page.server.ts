import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { error, type Actions, redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) throw error(404, 'No api provided');

  let data: { post: any; comments: any; } = {
    post: null,
    comments: null
  }
  const post_response = await fetch(`${base_api_url}/posts/${params.id}`);
  if (post_response.ok) {
    data.post = post_response.json()
  }
  const comments_response = await fetch(`${base_api_url}/comments/${params.id}`);
  if (comments_response.ok) {
    data.comments = comments_response.json()
  }
  return {
    post: data.post,
    comments: data.comments,
  }
};

export const actions: Actions = {
  createComment: async ({ request, cookies }) => {
    const form = await request.formData();
    const content = form.get('content');
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, "/login");
    if (!base_api_url) throw error(404, 'No api provided');
    const url = `${base_api_url}/comments/`;
    const body = {
      "content": content?.toString(),
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
    }
    const response = await fetch(url, options);
  },
  deleteComment: async ({ request, cookies }) => {
    const form = await request.formData();
    const comment_id = form.get('comment_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, "/login");
    if (!base_api_url) throw error(404, 'No api provided');
    if (!comment_id) return fail(400, { commentIdMissing: true });

    const url = `${base_api_url}/comments/${comment_id}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    }
    const response = await fetch(url, options);
  }

}
