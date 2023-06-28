<script lang="ts">
  import type { LayoutData } from "./$types";
	import NavBar from '$components/NavBar.component.svelte';
</script>

<div class="bg-purpleDark min-h-screen">
	<div class="grid grid-cols-12 px-[min(6%,_70px)] gap-[20px] max-w-7xl mx-auto">
		<div class="col-span-2 mt-8"><NavBar login={true} /></div>
		<slot><!-- optional fallback --></slot>
	</div>
</div>

<!-- <style> -->
<!--   div div { -->
<!--     padding-left: min(5%, 70px); -->
<!--   } -->
<!-- </style> -->
