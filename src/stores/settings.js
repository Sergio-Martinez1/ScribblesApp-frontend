import { writable } from "svelte/store";

const settings = writable({
  previousPage: "",
  dark_mode: "disabled",
  color_scheme: ""
});

export default settings;
