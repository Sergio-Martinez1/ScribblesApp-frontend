<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Edit from './Icon/Edit.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		applyAction({ type: 'success', status: 200 });
	});

	export let form: ActionData;
	export let username: string;

	let editable: boolean = false;
	let content: string | null = username;
	let input: HTMLInputElement;
	let hoverOnEditButton: boolean = false;
	$: validContent = username != content ? true : false;
</script>

<section class="flex flex-col gap-y-4">
	<h1 class="dark:text-white text-4xl font-bold">Change your username</h1>
	<form method="post" action="/settings?/changeUsername" use:enhance class="flex flex-col gap-y-4">
		<div class="flex items-center">
			<input
				bind:this={input}
				type="text"
				name="username"
				bind:value={content}
				class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 disabled:opacity-50 w-52"
				placeholder="username"
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
					in:fade|local={{ duration: 200 }}
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
			{/if}
		</div>
		{#if form?.usernameMissing}
			<p
				in:fly|local={{ y: 10 }}
				out:fly|local={{ y: -10, duration: 150 }}
				class="error text-squeezeRed"
			>
				Username can not be empty
			</p>
		{/if}
		{#if form?.usernameExists}
			<p
				in:fly|local={{ y: 10 }}
				out:fly|local={{ y: -10, duration: 150 }}
				class="error text-squeezeRed"
			>
				Username already exits, choose another
			</p>
		{/if}
		{#if editable}
			<input
				in:fly|local={{ y: -10, duration: 180 }}
				out:fly|local={{ y: -10, duration: 150 }}
				type="password"
				name="password"
				class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
				placeholder="password"
			/>
			{#if form?.passwordMissing}
				<p
					in:fly|local={{ y: 10 }}
					out:fly|local={{ y: -10, duration: 150 }}
					class="error text-squeezeRed"
				>
					Password required
				</p>
			{/if}
			{#if form?.wrongPassword}
				<p
					in:fly|local={{ y: 10 }}
					out:fly|local={{ y: -10, duration: 150 }}
					class="error text-squeezeRed"
				>
					Invalid password
				</p>
			{/if}
			<div>
				<button
					in:fly|local={{ y: -10, duration: 500 }}
					out:fly|local={{ y: -10, duration: 150 }}
					type="button"
					class="text-white bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-16 rounded-full py-1.5 px-1.5 mr-2"
					on:click={async () => {
						await applyAction({ type: 'success', status: 200 });
						editable = false;
						input.disabled = true;
						content = username;
					}}
				>
					Cancel
				</button>
				<button
					in:fly|local={{ y: -10, duration: 500 }}
					out:fly|local={{ y: -10, duration: 150 }}
					type="submit"
					disabled={!validContent}
					class="text-white bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple w-16 rounded-full py-1.5 px-1.5 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
					>Save</button
				>
			</div>
		{/if}
	</form>
</section>
