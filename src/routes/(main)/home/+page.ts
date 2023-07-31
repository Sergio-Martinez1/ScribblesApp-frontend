import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
  return {
    streamed: 'streamed' in data ? data.streamed : null
  };
};
