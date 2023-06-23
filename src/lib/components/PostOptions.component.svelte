<script lang="ts">
	import Options from '$lib/components/Icon/Options.svelte';
	import { fly } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside';
	import Slash from '$lib/components/Icon/Slash.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';

	export let editable: boolean;
	export let creator_id: number;
	export let user_id: number;

	let options_toogle: boolean = false;

	function handleClickOutside() {
		options_toogle = false;
	}
</script>

<div class="relative">
	<div
		class="w-[30px] cursor-pointer hover:bg-hoverPurple rounded-2xl"
		on:click={() => {
			options_toogle = !options_toogle;
		}}
		on:keypress={() => {}}
		use:clickOutside={'.options-component'}
		on:click_outside={handleClickOutside}
	>
		<Options />
	</div>
	{#if options_toogle}
		<div in:fly|local={{ y: 10 }} class="absolute right-0 top-8 z-10">
			<div
				class="options-component bg-purpleGray p-5 w-48 rounded-2xl shadow-[0px_0px_10px_1px_black]"
			>
				{#if user_id && user_id == creator_id}
					<button
						on:click={() => {
							editable = !editable;
							options_toogle = false;
						}}
						class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 mb-3.5 rounded-2xl w-full flex items-center justify-center gap-2"
					>
						<Edit width={18} height={18}/>Edit post
					</button>
					<button
						on:click={() => {
							options_toogle = false;
              document.getElementById("delete-dialog").showModal();
						}}
						class="bg-purpleLight hover:bg-squeezeRed text-white p-2.5 rounded-2xl w-full flex items-center justify-center gap-2"
					>
						<Trash width={18} height={18}/>Delete post
					</button>
				{:else}
					<button class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 rounded-2xl w-full flex items-center gap-2"
						><Slash width={18} height={18}/>Don't show this</button
					>
				{/if}
			</div>
		</div>
	{/if}
</div>
