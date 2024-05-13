<script lang="ts">
	export let width: number = 24,
		height: number = 24;
  export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M19 12H5"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
    class={tailwindStrokeClass}
	/>
	<path
		d="M12 19L5 12L12 5"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
    class={tailwindStrokeClass}
	/>
</svg>
