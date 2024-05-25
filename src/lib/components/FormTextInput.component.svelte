<script lang="ts">
	import { enhance } from '$app/forms';
	import Plus from './Icon/Plus.svelte';
	import Edit from './Icon/Edit.svelte';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let inputName: string;
	export let formActionUrl: string;
	export let data: string | null = '';
	export let placeholder: string = 'write something';

	let is_there_initial_content: boolean = data ? true : false;
	let editable: boolean = false;
	let content: string | null = data;
	let input: HTMLInputElement;
	let hoverOnEditButton: boolean = false;
	$: validContent = data != content ? true : false;

	function focusAndEnableInput() {
		editable = true;
		tick().then(() => {
			input.disabled = false;
			input.focus();
		});
	}
</script>

<form method="post" action={formActionUrl} use:enhance class="min-[440px]:flex-row flex flex-wrap gap-y-4">
	{#if !is_there_initial_content && !editable}
		<button
			type="button"
			class="flex items-center dark:text-white gap-x-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple'} w-fit rounded-full py-1.5 px-1.5 mr-2"
			on:click={focusAndEnableInput}
		>
			<div class="flex gap-x-2 items-center mx-1.5">
				<Plus width={18} height={18} />
				<slot />
			</div>
		</button>
	{:else if is_there_initial_content || editable}
		<input
			bind:this={input}
			type="text"
			name={inputName}
			bind:value={content}
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl w-44 h-9 dark:text-white mr-2 px-2 disabled:opacity-50"
			{placeholder}
			disabled
		/>
		{#if !editable}
			<button
				on:mouseenter={() => {
					hoverOnEditButton = true;
				}}
				on:mouseleave={() => {
					hoverOnEditButton = false;
				}}
				in:fade={{ delay: 150, duration: 80 }}
				on:click={() => {
					editable = true;
					input.disabled = false;
					input.focus();
					hoverOnEditButton = false;
				}}
				><Edit
					tailwindStrokeClass={hoverOnEditButton
						? 'stroke-black dark:stroke-white'
						: 'stroke-krispyPurple'}
				/></button
			>
		{:else}
			<div class="flex">
				<button
					in:fly|global={{ x: -10, duration: 180 }}
					type="button"
					class="text-white bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-16 rounded-full py-1.5 px-1.5 mr-2"
					on:click={() => {
						editable = false;
						input.disabled = true;
						content = data;
					}}
				>
					Cancel
				</button>
				<button
					in:fly|global={{ x: -10, duration: 180 }}
					type="submit"
					disabled={!validContent}
					class="text-white bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple w-16 rounded-full py-1.5 px-1.5 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
					>Save</button
				>
			</div>
		{/if}
	{/if}
</form>
