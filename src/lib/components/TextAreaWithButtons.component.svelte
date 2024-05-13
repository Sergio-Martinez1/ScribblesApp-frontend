<script lang="ts">
	export let initialContent: string = '';
	export let input_name: string = 'text';
	export let maxContent: number = 150;
	export let cancelAction: boolean = false;

	let validContent: boolean = false;
	let content: string = initialContent;
	let outputText: string = content;

	$: charsCount = content.trim().length;
	$: validContent = charsCount <= maxContent && initialContent != content ? true : false;
</script>

<div class="w-fit flex flex-col">
	<textarea
		class="bg-lavandaLight dark:bg-purpleLight outline-none focus:border focus:border-krispyPurple dark:text-white px-2 py-1 w-60 mx-auto rounded-2xl resize-none"
		name={input_name}
		id={input_name}
		cols="15"
		bind:value={content}
		rows="4"
	/>
	<p
		class="w-fit self-end text-sm mt-0.5 {charsCount > 150
			? 'text-squeezeRed'
			: 'dark:text-white opacity-50'}"
	>
		Chars left: {maxContent - charsCount}
	</p>
	<div class="flex justify-center gap-x-6">
		<button
			type="button"
			class="bg-squeezeRed active:bg-squeezeRed hover:bg-red-400 text-white w-20 h-8 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
			on:click={() => {
				cancelAction = !cancelAction;
			}}>Cancel</button
		>
		<button
			type="submit"
			disabled={!validContent}
			class="bg-krispyPurple active:bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple text-white w-20 h-8 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
			>Save</button
		>
	</div>
	<input type="hidden" name={input_name} value={outputText} />
</div>
