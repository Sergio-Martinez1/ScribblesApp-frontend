<script lang="ts">
	export let width: number = 22,
		height: number = 21,
		fill: string = 'none';
	export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 22 21" {fill} xmlns="http://www.w3.org/2000/svg">
	<path
		d="M18.5163 11.7338L12.2425 18.0075C12.08 18.1702 11.887 18.2993 11.6745 18.3874C11.4621 18.4754 11.2344 18.5208 11.0044 18.5208C10.7744 18.5208 10.5467 18.4754 10.3342 18.3874C10.1218 18.2993 9.92878 18.1702 9.76625 18.0075L2.25 10.5V1.75H11L18.5163 9.26625C18.8422 9.59414 19.0251 10.0377 19.0251 10.5C19.0251 10.9623 18.8422 11.4059 18.5163 11.7338Z"
		stroke="white"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={tailwindStrokeClass}
	/>
	<path
		d="M6.625 6.125H6.63361"
		stroke="white"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={tailwindStrokeClass}
	/>
</svg>
