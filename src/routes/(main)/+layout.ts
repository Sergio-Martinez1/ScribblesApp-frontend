import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
  return {
    my_reactions: data.my_reactions
  };
};
