import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
  return {
    username: data?.username ?? '',
    id: data?.id ?? '',
    profile_photo: data?.profile_photo ?? ''
  };
};
