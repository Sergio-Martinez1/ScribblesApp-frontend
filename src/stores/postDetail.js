import { writable } from "svelte/store";

const settings = writable({
  previousPage: ""
});

export default settings;
