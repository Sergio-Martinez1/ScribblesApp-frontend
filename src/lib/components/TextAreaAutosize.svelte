<script lang="ts">
	//RAW TEXT
	export let innerText: string = '';
	//FORMATED TEXT
	export let outputText: string = '';
	//STATE
	export let showPlaceHolder: boolean = true;
	export let focus: boolean = false;
	export let focus_text: boolean = false;
	//STYLES
	export let placeHolder: string = "What's happening?";
  export let maxSize: string = "";

	$: outputText = innerText.replace(/\n{3,}/g, '\n\n');
</script>

<div class="relative">
	{#if showPlaceHolder}
		<p class="text-white opacity-50 absolute top-0">{placeHolder}</p>
	{/if}
	<div
		class="text-bar text-white outline-none break-all relative overflow-y-auto max-h-80"
    style="height: {maxSize};"
		bind:innerText
		on:input={() => {
			showPlaceHolder =
				innerText.trim().length === 0 && (innerText.match(/\n|\s/g) || []).length === 1
					? true
					: false;
		}}
		on:focus={() => {
			focus = true;
			focus_text = true;
		}}
		on:focusout={() => {
			focus_text = false;
		}}
		contenteditable="true"
	/>
</div>
