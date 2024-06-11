import { writable } from "svelte/store";

const settings = writable({
  previousPage: "",
  dark_mode: "enabled",
  color_scheme: "",
  scrollY: 0
});

export default settings;
