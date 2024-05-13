<script lang="ts">
	export let width: number = 24,
		height: number = 24;
  export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M6 53.0566H53.0566M53.0566 53.0566H100.113M53.0566 53.0566V6M53.0566 53.0566V100.113"
		stroke="white"
		stroke-width="11.7642"
		stroke-linecap="round"
		stroke-linejoin="round"
    class={tailwindStrokeClass}
	/>
</svg>
