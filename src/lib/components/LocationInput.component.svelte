<script lang="ts">
	import { enhance } from '$app/forms';
	import Plus from './Icon/Plus.svelte';
	import Edit from './Icon/Edit.svelte';
	import { tick } from 'svelte';

	export let location: string | null = '';

	let is_there_initial_content: boolean = location ? true : false;
	let editable: boolean = false;
	let content: string | null = location;
	let input: HTMLInputElement;
	$: validContent = location != content ? true : false;

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
	action="/settings?/editLocation"
	use:enhance
	class="flex"
>
	{#if !is_there_initial_content && !editable}
		<button
			type="button"
			class="flex items-center dark:text-white gap-x-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple'} w-fit rounded-full py-1.5 px-1.5 mr-2"
			on:click={focusAndEnableInput}
		>
			<div class="flex gap-x-2 items-center mx-1.5">
				<Plus width={18} height={18} />
				<p>Add location</p>
			</div>
		</button>
	{:else if is_there_initial_content || editable}
		<input
			bind:this={input}
			type="text"
			name="location"
			bind:value={content}
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 focus:outline-none focus:border-2 focus:border-krispyPurple disabled:opacity-50"
			placeholder="New York, US"
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
				class="flex items-center dark:text-white gap-x-2 bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-fit rounded-full py-1.5 px-1.5 mr-2"
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
				class="dark:text-white bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple w-fit rounded-full py-1.5 px-1.5 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
				>Save</button
			>
		{/if}
	{/if}
</form>
