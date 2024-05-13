<script lang="ts">
	export let width: number = 22,
		height: number = 21,
		fill: string = 'none';
	export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 22 21" {fill} xmlns="http://www.w3.org/2000/svg">
	<path
		d="M18.875 10.0625C18.878 11.2174 18.6082 12.3567 18.0875 13.3875C17.4701 14.6228 16.521 15.6618 15.3465 16.3881C14.172 17.1145 12.8185 17.4995 11.4375 17.5C10.2826 17.503 9.14335 17.2332 8.1125 16.7125L3.125 18.375L4.7875 13.3875C4.26681 12.3567 3.99699 11.2174 4 10.0625C4.00053 8.68156 4.38554 7.32802 5.11188 6.15351C5.83822 4.97899 6.87722 4.0299 8.1125 3.41253C9.14335 2.89184 10.2826 2.62201 11.4375 2.62502H11.875C13.6988 2.72564 15.4214 3.49544 16.713 4.78703C18.0046 6.07861 18.7744 7.80122 18.875 9.62503V10.0625Z"
		stroke="white"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
    class={tailwindStrokeClass}
	/>
</svg>
