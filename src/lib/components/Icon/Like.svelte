<script lang="ts">
	export let width: number = 20,
		height: number = 20,
		fill: string = 'none',
		stroke: string = 'white';
	export let tailwindStrokeClass: string = '';
</script>

<svg {width} {height} viewBox="0 0 20 20" {fill} xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_202_617)">
		<path
			d="M5.83329 9.16663L9.16663 1.66663C9.82967 1.66663 10.4656 1.93002 10.9344 2.39886C11.4032 2.8677 11.6666 3.50359 11.6666 4.16663V7.49996H16.3833C16.6249 7.49723 16.8642 7.54705 17.0846 7.64598C17.305 7.7449 17.5013 7.89057 17.6598 8.07289C17.8184 8.25521 17.9354 8.46981 18.0027 8.70184C18.0701 8.93386 18.0862 9.17776 18.05 9.41663L16.9 16.9166C16.8397 17.3141 16.6378 17.6763 16.3315 17.9366C16.0253 18.197 15.6352 18.3378 15.2333 18.3333H5.83329M5.83329 9.16663V18.3333M5.83329 9.16663H3.33329C2.89127 9.16663 2.46734 9.34222 2.15478 9.65478C1.84222 9.96735 1.66663 10.3913 1.66663 10.8333V16.6666C1.66663 17.1087 1.84222 17.5326 2.15478 17.8451C2.46734 18.1577 2.89127 18.3333 3.33329 18.3333H5.83329"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={tailwindStrokeClass}
		/>
	</g>
	<defs>
		<clipPath id="clip0_202_617">
			<rect width="20" height="20" fill="white" />
		</clipPath>
	</defs>
</svg>
