<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Plus from './Icon/Plus.svelte';
	import Edit from './Icon/Edit.svelte';
	import { tick } from 'svelte';
	import ButtonSmall from './ButtonSmall.component.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	export let birthday: string | null = '';

	let is_there_initial_content: boolean = birthday ? true : false;
	let editable: boolean = false;
	let content: string | null = birthday;
	let input: HTMLInputElement;
	let hoverOnEditButton: boolean = false;
	let isLoading: boolean = false;
	let error: boolean = false;
	let submitButton: any;
	$: validContent = birthday != content ? true : false;

	function focusAndEnableInput() {
		editable = true;
		tick().then(() => {
			input.disabled = false;
			input.focus();
		});
	}

	const submit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				invalidateAll();
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				isLoading = false;
				error = true;
			}
			isLoading = false;
		};
	};
</script>

<form
	method="post"
	action="/settings?/editBirthday"
	use:enhance={submit}
	class="flex"
	id="birthdayForm"
>
	{#if !is_there_initial_content && !editable}
		<button
			type="button"
			class="flex items-center dark:text-white gap-x-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple'} w-fit rounded-full py-1.5 px-1.5 mr-2"
			on:click={focusAndEnableInput}
		>
			<div class="flex gap-x-2 items-center mx-1.5">
				<Plus width={18} height={18} />
				<span class="text-white">Add Birthday</span>
			</div>
		</button>
	{:else if is_there_initial_content || editable}
		<input
			bind:this={input}
			bind:value={content}
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl px-2 py-1 dark:text-white box w-fit h-9 mr-2 disabled:opacity-50"
			type="date"
			id="birthday"
			name="birthday"
			placeholder="yyyy-mm-dd"
			min="1900-01-01"
			max="2030-12-31"
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
			<button
				in:fly|global={{ x: -10, duration: 180 }}
				type="button"
				class="flex items-center justify-center self-center justify-self-center text-white gap-x-2 bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-20 h-8 rounded-full py-1.5 px-1.5 mr-2"
				on:click={() => {
					editable = false;
					input.disabled = true;
					submitButton.resetButtonState();
				}}
			>
				Cancel
			</button>

			<div
				in:fly|global={{ x: -10, duration: 180 }}
				class="col-start-2 self-center justify-self-center"
			>
				<ButtonSmall
					disabled={!validContent || isLoading}
					{isLoading}
					bind:error
					bind:this={submitButton}
					text={'Save'}
				/>
			</div>
		{/if}
	{/if}
</form>
