import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { TopTag, Post } from '$lib/types';

export const load: PageServerLoad = ({ fetch, cookies }) => {

  const base_api_url: string | undefined = env.API_URL;
  let fetchedPosts = { data: null, status: 500 };
  let fetchedTags = { data: null, status: 500 };
  let posts_response: Promise<{ data: Array<Post> | null, status: number }> = Promise.resolve(fetchedPosts);
  let top_tags_response: Promise<{ data: Array<TopTag> | null, status: number }> = Promise.resolve(fetchedTags);

  if (!base_api_url) {
    console.error(`Error: Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
    return {
      streamed: {
        posts: posts_response,
        top_tags: top_tags_response
      }
    }
  }

  top_tags_response = fetch(`${base_api_url}/tags/top`)
    .then(async (response) => {
      fetchedTags.status = response.status;
      if (response.ok) {
        const data = await response.json();
        fetchedTags.data = data;
      }
      return fetchedTags;
    }).catch((error) => {
      console.error(`Error: Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener "Top tags"\n\t- ${error}`)
      return fetchedTags;
    })

  const access_token = cookies.get('access_token');
  if (!access_token) {
    posts_response = fetch(`${base_api_url}/posts/pagination?offset=0&limit=20`)
      .then(async (response) => {
        fetchedPosts.status = response.status;
        if (response.ok) {
          const data = await response.json();
          fetchedPosts.data = data;
        }
        return fetchedPosts;
      }).catch((error) => {
        console.error(`Error: Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener posts publicos\n\t- ${error}`)
        return fetchedPosts;
      });
    return {
      streamed: {
        posts: posts_response,
        top_tags: top_tags_response
      }
    }
  }

  const home_url = `${base_api_url}/posts/home?offset=0&limit=20`;
  const posts_url = `${base_api_url}/posts/pagination?limit=20&offset=0`;
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
      } else if (response.status == 401) {
        await fetch(posts_url).then(async (response) => {
          fetchedPosts.status = response.status;
          if (response.ok) {
            const data = await response.json();
            fetchedPosts.data = data;
          }
        }).catch((error) => {
          console.error(`Error: Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener posts publicos\n\t- ${error}`)
        })
      }
      return fetchedPosts;
    }).catch((error) => {
      console.error(`Error: Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener posts de home\n\t- ${error}`)
      return fetchedPosts;
    })

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
    if (!base_api_url) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
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
        return fail(500, { serverFail: true });
      } catch (error) {
        console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar toogle_reaction\n\t- ${error}`)
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
        return fail(500, { serverFail: true });
      } catch (error) {
        console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar toogle_reaction\n\t- ${error}`)
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
    if (!base_api_url) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }

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
      try {
        const response = await fetch(files_url, options);
        if (response.ok) {
          let img = await response.json();
          return img.url;
        }
        throw error(response.status, response.statusText);
      } catch (error) {
        console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al obtener url de la imagen\n\t- ${error}`)
        return ''
      }
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
    try {
      const response = await fetch(posts_url, options);
      if (response.ok) return;
      else if (response.status === 401) throw redirect(303, "/login");
      throw error(response.status, response.statusText);
    } catch (error) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar crear un post\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
  },
  deletePost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');

    if (!access_token) throw redirect(303, '/login');
    if (!base_api_url) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!post_id) return fail(400, { postIdMissing: true });

    const posts_url = `${base_api_url}/posts/${post_id}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    };
    try {
      const response = await fetch(posts_url, options);
      if (response.ok) return;
      else if (response.status === 401) throw redirect(303, "/login");
      throw error(response.status, response.statusText);
    } catch (error) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar eliminar un post\n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
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
    const base_api_url: string = env.API_URL;
    const post_url = `${base_api_url}/posts/${post_id}`;
    const files_url = `${base_api_url}/files/`;
    const access_token = cookies.get('access_token');

    if (!access_token) throw redirect(303, '/login');
    if (!base_api_url) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!post_id) return fail(400, { postIdMissing: true });

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
      try {
        const response = await fetch(files_url, options);
        if (response.ok) {
          let img = await response.json();
          return img.url;
        } else if (response.status === 401) throw redirect(303, "/login");
        throw error(response.status, response.statusText);
      } catch (error) {
        console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar obtener la url de la imagen\n\t- ${error}`)
        return fail(500, { serverFail: true });
      }
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
    try {
      const response = await fetch(post_url, options);
      if (response.ok) return;
      else if (response.status === 401) throw redirect(303, "/login");
      throw error(response.status, response.statusText);
    } catch (error) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar editar el post \n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
  },
  dontShowPost: async ({ request, fetch, cookies }) => {
    const form = await request.formData();
    const post_id = form.get('post_id');
    const base_api_url: string | undefined = env.API_URL;
    const access_token = cookies.get('access_token');
    if (!access_token) throw redirect(303, '/login');
    if (!base_api_url) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+layout.server.ts].\n\t- No se encontro la url de la api en el entorno`);
      return fail(500, { serverFail: true });
    }
    if (!post_id) return fail(400, { postIdMissing: true });

    const posts_url = `${base_api_url}/posts/dont_show_post/${post_id}`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    };
    try {
      const response = await fetch(posts_url, options);
      if (response.ok) return;
      else if (response.status === 401) throw redirect(303, "/login");
      throw error(response.status, response.statusText);
    } catch (error) {
      console.error(`Error(Action): Error en [/routes/(main)/home/+page.server.ts].\n\t- Error al intentar ocultar un post \n\t- ${error}`)
      return fail(500, { serverFail: true });
    }
  }
};
