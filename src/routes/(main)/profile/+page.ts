import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  return {
    myUser: data?.myUser ?? '',
    myPosts: data?.myPosts ?? ''
  };
};
