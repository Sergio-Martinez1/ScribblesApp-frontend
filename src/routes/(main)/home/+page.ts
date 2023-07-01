import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  return {
    posts: data.posts,
    top_tags: data.top_tags
  };
};
