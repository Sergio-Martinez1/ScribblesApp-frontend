import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = ({ fetch, cookies }) => {
  let posts_response = null;
  let top_tags_response = null;
  let fetchedPosts = { data: null, status: 500 };
  let fetchedTags = { data: null, status: 500 };

  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) console.error('Error: No se encontro la url de la api - [/routes/(main)/home/+layout.server.ts]');;

  top_tags_response = fetch(`${base_api_url}/tags/top`)
    .then(async (response) => {
      fetchedTags.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedTags.data = data;
      }
      return fetchedTags;
    }).catch(() => {
      console.error('Error: Error al intentar conectarse con la api en ruta de tags - [/routes/(main)/home/+page.server.ts]')
    })

  const access_token = cookies.get('access_token');
  if (access_token) {
    const home_url = `${base_api_url}/posts/home?offset=0&limit=20`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    };

    posts_response = fetch(home_url, options)
      .then(async (response) => {
        fetchedPosts.status = response.status;
        if (response.ok) {
          const data = await response.json();
          fetchedPosts.data = data;
        }
        return fetchedPosts;
      }).catch(() => {
        console.error('Error: Error al intentar conectarse con la api en ruta de posts - [/routes/(main)/home/+page.server.ts]')
      })
  } else {
    posts_response = fetch(`${base_api_url}/posts/pagination?offset=0&limit=20`)
      .then(async (response) => {
        fetchedPosts.status = response.status;
        if (response.ok) {
          const data = await response.json();
          fetchedPosts.data = data;
        }
        return fetchedPosts;
      }).catch(() => {
        console.error('Error: Error al intentar conectarse con la api en ruta de posts - [/routes/(main)/home/+page.server.ts]')
      });
  }

  return {
    streamed: {
      posts: posts_response,
      top_tags: top_tags_response
    }
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

      try {
        const response = await fetch(url, options);
        if (response.ok) return;
        else if (response.status === 401) throw redirect(303, "/login");
        return fail(400, { badRequest: true });
      } catch (error) {
        console.error('Error: Error al intentar conectarse con la api - [/routes/(main)/home/+page.server.ts]')
        return fail(500, { serverFail: true });
      }

    } else if (state_on === 'false') {
      const url = `${base_api_url}/reactions/${post_id}`;
      const options = {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      };

      try {
        const response = await fetch(url, options);
        if (response.ok) return;
        else if (response.status === 401) throw redirect(303, "/login");
        return fail(400, { badRequest: true });
      } catch (error) {
        console.error('Error: Error al intentar conectarse con la api - [/routes/(main)/home/+page.server.ts]')
        return fail(500, { serverFail: true });
      }
      
    }
  },
  createPost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const content = form.get('content');
    const thumbnail = form.get('thumbnail') as File;
    const raw_tags = form.get('tags')?.toString();
    const tags = raw_tags ? raw_tags?.split(',') : '';
    const is_there_thumbnail = thumbnail?.size > 0 ? true : false;

    const base_api_url: string = env.API_URL;
    const posts_url = `${base_api_url}/posts/`;
    const files_url = `${base_api_url}/files/`;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, '/login');

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
      const response = await fetch(files_url, options);
      if (response.ok) {
        let img = await response.json();
        return img.url;
      } else return '';
    };

    let thumbnail_url: string = '';
    if (is_there_thumbnail) {
      thumbnail_url = await image_url_request(thumbnail);
    }

    const body = {
      ...(content ? { content } : {}),
      ...(is_there_thumbnail ? { thumbnail: thumbnail_url } : {}),
      ...(tags ? { tags } : [])
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
    const response = await fetch(posts_url, options);
    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login");
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
    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login");
  },
  editPost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const content = form.get('content');
    const thumbnail = form.get('thumbnail') as File;
    const old_image = form.get('old_image') as string;
    const post_id = form.get('post_id');
    const raw_tags = form.get('tags')?.toString();
    const tags = raw_tags ? raw_tags?.split(',') : '';
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
      const response = await fetch(files_url, options);
      if (response.ok) {
        let img = await response.json();
        return img.url;
      } else if (response.status === 401) throw redirect(303, "/login");
    };

    let thumbnail_url: string = '';
    if (is_there_thumbnail) {
      thumbnail_url = await image_url_request(thumbnail);
    }
    else if (old_image) {
      thumbnail_url = old_image;
    }

    const body = {
      ...(content ? { content } : {}),
      ...(thumbnail_url ? { thumbnail: thumbnail_url } : {}),
      ...(tags ? { tags } : [])
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
    const response = await fetch(post_url, options);
    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login");
  },
  dontShowPost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, '/login');
    if (!base_api_url) throw error(404, 'No api provided');
    if (!post_id) return fail(400, { postIdMissing: true });

    const posts_url = `${base_api_url}/posts/dont_show_post/${post_id}`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    };
    const response = await fetch(posts_url, options);
    if (response.ok) return;
    else if (response.status === 401) throw redirect(303, "/login");
  }
};
