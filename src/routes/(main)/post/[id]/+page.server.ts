import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { type Actions, redirect, fail } from "@sveltejs/kit";
import type { Post, Comment } from '$lib/types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const load: PageServerLoad = async ({ fetch, params }) => {
  const base_api_url: string | undefined = env.API_URL;
  let fetchedPost = { data: null, status: 500 };
  let fetchedComments = { data: null, status: 500 };
  let post_response: Promise<{ data: Post | null, status: number }> = Promise.resolve(fetchedPost);
  let comments_response: Promise<{ data: Array<Comment> | null, status: number }> = Promise.resolve(fetchedComments);

  if (!base_api_url) {
    console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        posts: post_response,
        comments: comments_response
      }
    }
  }

  post_response = fetch(`${base_api_url}/posts/${params.id}`)
    .then(async (response) => {
      fetchedPost.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedPost.data = data;
      }
      return fetchedPost;
    }).catch((error) => {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener la inf del post\n\t- ${error}`)
      return fetchedPost;
    });
  comments_response = fetch(`${base_api_url}/comments/${params.id}`)
    .then(async (response) => {
      fetchedComments.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedComments.data = data;
      }
      return fetchedComments;
    }).catch((error) => {
      console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener los comentarios del post\n\t- ${error}`)
      return fetchedPost;
    });

  return {
    streamed: {
      post: post_response,
      comments: comments_response,
    }
  }
};

export const actions: Actions = {
  createComment: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const content = form.get('content');
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');

    if (!access_token) throw redirect(303, "/login");
    if (!base_api_url) {
      console.error(`Error(Action): Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!content) return fail(400, { contentMissing: true });
    if (!post_id) return fail(400, { post_idMissing: true });

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
    try {
      const response = await fetch(url, options);
      if (response.ok) return;
      else if (response.status !== 401) return fail(response.status, { serverFail: true });
    } catch (error) {
      console.error(`Error(Action): Error en [${__route}].\n\t- Error al intentar createComment\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
    throw redirect(303, "/login");
  },
  deleteComment: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const comment_id = form.get('comment_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');

    if (!access_token) throw redirect(303, "/login");
    if (!base_api_url) {
      console.error(`Error(Action): Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!comment_id) return fail(400, { commentIdMissing: true });

    const url = `${base_api_url}/comments/${comment_id}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    }
    try {
      const response = await fetch(url, options);
      if (response.ok) return;
      else if (response.status !== 401) return fail(response.status, { serverFail: true });
    } catch (error) {
      console.error(`Error(Action): Error en [${__route}].\n\t- Error al intentar deleteComment\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
    throw redirect(303, "/login");
  },
  deletePost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');

    if (!access_token) throw redirect(303, "/login");
    if (!base_api_url) {
      console.error(`Error(Action): Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!post_id) return fail(400, { postIdMissing: true });

    const posts_url = `${base_api_url}/posts/${post_id}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    }
    try {
      const response = await fetch(posts_url, options);
      if (response.ok) throw redirect(303, "/home");
      else if (response.status !== 401) return fail(response.status, { serverFail: true });
    } catch (error) {
      console.error(`Error(Action): Error en [${__route}].\n\t- Error al intentar deletePost\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
    throw redirect(303, "/login");
  }
}
