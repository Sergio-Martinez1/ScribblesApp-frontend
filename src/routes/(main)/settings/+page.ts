import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
  return {
    streamed : 'streamed' in data ? data.streamed : null
  }
};
