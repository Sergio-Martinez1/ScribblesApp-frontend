import { writable } from "svelte/store";

const session = writable({
  home: {
    posts: [],
    offset: 0,
    limit: 5,
    scrollY: 0
  },
});

export default session;
