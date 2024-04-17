<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Plus from './Icon/Plus.svelte';
	import Edit from './Icon/Edit.svelte';
	import { tick } from 'svelte';

	export let personal_url: string = '';

	let is_there_initial_content: boolean = personal_url ? true : false;
	let editable: boolean = false;
	let content: string = personal_url;
	let input: HTMLInputElement;
	$: validContent = personal_url != content ? true : false;

	function focusAndEnableInput() {
		editable = true;
		tick().then(() => {
			input.disabled = false;
			input.focus();
		});
	}
</script>

<form
	method="post"
	action="/settings?/editWebSite"
	use:enhance
	class="flex"
>
	{#if !is_there_initial_content && !editable}
		<button
			type="button"
			class="flex items-center text-white gap-x-2 bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple'} w-fit rounded-full py-1.5 px-1.5 mr-2"
			on:click={focusAndEnableInput}
		>
			<div class="flex gap-x-2 items-center mx-1.5">
				<Plus width={18} height={18} />
				<p>Add url</p>
			</div>
		</button>
	{:else if is_there_initial_content || editable}
		<input
			bind:this={input}
			type="text"
			name="personal_url"
			bind:value={content}
			class="bg-purpleLight rounded-2xl h-9 text-white mr-2 px-2 focus:outline-none focus:border-2 focus:border-krispyPurple disabled:opacity-50"
			placeholder="https://example.com"
			disabled
		/>
		{#if !editable}
			<button
				on:click={() => {
					editable = true;
					input.disabled = false;
					input.focus();
				}}><Edit color={'#931DF0'} /></button
			>
		{:else}
			<button
				type="button"
				class="flex items-center text-white gap-x-2 bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-fit rounded-full py-1.5 px-1.5 mr-2"
				on:click={() => {
					editable = false;
					input.disabled = true;
				}}
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={!validContent}
				class="text-white bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple w-fit rounded-full py-1.5 px-1.5 disabled:bg-lessPurple disabled:opacity-[0.5]"
				>Save</button
			>
		{/if}
	{/if}
</form>
