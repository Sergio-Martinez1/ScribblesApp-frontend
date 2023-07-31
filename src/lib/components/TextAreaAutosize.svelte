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
	export let maxSize: string = '';

	let key: string;

	$: outputText = innerText.replace(/\n{3,}/g, '\n\n');

	function handleInput(event) {
		key = event.key as string;
		showPlaceHolder = false;
		if (key === 'Backspace' && innerText.length === 0) showPlaceHolder = true;
		//Evita que se cree un espacio al borrar el contenido
		if (key === 'Backspace' && innerText.length === 1) {
			innerText = '';
			showPlaceHolder = true;
		}
		//Evita que se cree un espacio al borrar saltos de linea
		if (
			key === 'Backspace' &&
			innerText.match(/(\r\n|\n|\r)/g)?.length === 3 &&
			innerText.length == 3
		) {
			innerText = '';
			showPlaceHolder = true;
		}
		//Evita que se agregue un espacio al ingresar espacios consecutivos
		if (key === ' ') {
      innerText = innerText.replace(/(\r\n|\n|\r)$/, 'a');
			// showPlaceHolder = true;
		}
	}
</script>

<div class="relative">
	{#if showPlaceHolder}
		<p class="text-white opacity-50 absolute top-0">{placeHolder}</p>
	{/if}
	<div
		class="text-bar text-white outline-none break-all relative overflow-y-auto max-h-80"
		style="height: {maxSize};"
		bind:innerText
		on:keydown={handleInput}
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
