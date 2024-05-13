<script lang="ts">
	export let width: number = 24,
		height: number = 24;
  export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 95 96" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M35.625 72L59.375 48L35.625 24"
		stroke="white"
		stroke-width="8"
		stroke-linecap="round"
		stroke-linejoin="round"
    class={tailwindStrokeClass}
	/>
</svg>
