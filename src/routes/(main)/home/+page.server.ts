import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) throw error(404, 'No api provided');

  const posts_response = await fetch(`${base_api_url}/posts/pagination?limit=20&offset=0`);
  const top_tags_response = await fetch(`${base_api_url}/tags/top`);

  return {
    posts: posts_response.ok ? posts_response.json() : undefined,
    top_tags: top_tags_response.ok ? top_tags_response.json() : undefined
  };
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
    if (!access_token) throw redirect(303, '/login');
    const base_api_url: string = env.API_URL;
    if (state_on === 'true') {
      const url = `${base_api_url}/reactions/`;
      const body = {
        post_id: Number(post_id)
      };
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
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
          accept: 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      };
      const response = await fetch(url, options);
      if (response.ok) return;
    }
  },
  createPost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const content = form.get('content');
    const thumbnail = form.get('thumbnail') as File;
    const raw_tags = form.get('tags')?.toString();
    const tags = raw_tags ? raw_tags?.split(',') : [];
    const is_there_thumbnail = thumbnail?.size > 0 ? true : false;

    const base_api_url: string = env.API_URL;
    const post_url = `${base_api_url}/posts/`;
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

    let thumbnail_url: string = '';
    if (is_there_thumbnail) {
      thumbnail_url = await image_url_request(thumbnail);
      console.log(thumbnail_url);
    }

    const body = {
      ...(content !== undefined ? { content } : {}),
      ...(is_there_thumbnail ? { thumbnail: thumbnail_url } : {}),
      ...(tags !== undefined ? { tags } : [])
    };

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    await fetch(post_url, options);
  },
  deletePost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, '/login');
    if (!base_api_url) throw error(404, 'No api provided');
    if (!post_id) return fail(400, { postIdMissing: true });

    const posts_url = `${base_api_url}/posts/${post_id}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    };
    const response = await fetch(posts_url, options);
  },
  editPost: async ({ request, fetch, cookies }) => {

    const form = await request.formData();
    const content = form.get('content');
    const thumbnail = form.get('thumbnail') as File;
    const post_id = form.get('post_id');
    const raw_tags = form.get('tags')?.toString();
    const tags = raw_tags ? raw_tags?.split(',') : [];
    const is_there_thumbnail = thumbnail?.size > 0 ? true : false;

    if (!post_id) return fail(400, { postIdMissing: true });

    const base_api_url: string = env.API_URL;
    const post_url = `${base_api_url}/posts/${post_id}`;
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

    let thumbnail_url: string = '';
    if (is_there_thumbnail) {
      thumbnail_url = await image_url_request(thumbnail);
    }

    const body = {
      ...(content !== undefined ? { content } : {}),
      ...(is_there_thumbnail ? { thumbnail: thumbnail_url } : {}),
      ...(tags !== undefined ? { tags } : [])
    };

    const options = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    await fetch(post_url, options);
  }
};
