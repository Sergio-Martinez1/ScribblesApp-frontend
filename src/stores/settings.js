import { writable } from "svelte/store";

const settings = writable({
  previousPage: "",
  color_scheme: ""
});

export default settings;
