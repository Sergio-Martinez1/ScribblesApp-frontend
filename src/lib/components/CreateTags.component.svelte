<script lang="ts">
	import X from '$lib/components/Icon/X.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	onMount(() => {
		input.focus();
	});

	export let tags: string[] = [];

	let inputText = '';
	let key: string;
	let focus_text: boolean = false;
	let input: HTMLDivElement;
	export let maxSize: string = '';

	function handleSubmit() {
		if (!inputText) return;
		if (tags.find((tag) => tag === inputText)) {
			inputText = '';
			return;
		}
		tags = [...tags, inputText];
		inputText = '';
	}

	function handleInput(event: KeyboardEvent) {
		key = event.key as string;
		if (!inputText && key === 'Backspace') {
			tags.pop();
			tags = tags;
		}
	}
</script>

<div
	id="tags-container"
	class="flex bg-lavandaLight dark:bg-purpleLight rounded-2xl flex-wrap pt-1 pr-2 border {focus_text
		? 'border-krispyPurple'
		: 'border-transparent'} overflow-y-auto"
	style="max-height: {maxSize};"
>
	{#each tags as tag}
		<div
			class="border border-krispyPurple rounded-2xl px-2 dark:text-white ml-2 mb-1 flex items-center gap-1.5 text-sm self-center"
			in:fly={{ x: -5 }}
			out:fly={{ x: -5, duration: 140 }}
		>
			{tag}
			<button
				type="button"
				class="cursor-pointer hover:bg-lessLavanda dark:hover:bg-lessPurple rounded-full"
				on:click={() => {
					tags = tags.filter((element) => element !== tag);
				}}
			>
				<X width={17} height={17} tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</button>
		</div>
	{/each}
	<form on:submit|preventDefault={handleSubmit} class="grow mx-2 mb-2">
		<input
			type="text"
			bind:value={inputText}
			bind:this={input}
			placeholder="Write tags for your post..."
			class="bg-transparent dark:text-white outline-none w-full text-sm"
			on:keydown={handleInput}
			on:focus={() => {
				focus_text = true;
			}}
			on:focusout={() => {
				focus_text = false;
			}}
		/>
	</form>
</div>
