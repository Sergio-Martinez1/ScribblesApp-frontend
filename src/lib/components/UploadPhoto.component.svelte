<script lang="ts">
	export let photo: string = '';
	export let input_name: string = 'photo';
	let uploadFile: HTMLInputElement;
	let selectedImage: string = '';

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				photo = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<button
	type="button"
	class="cursor-pointer self-start relative"
	on:click={() => {
		uploadFile.click();
	}}
>
	<p
		class="text-krispyPurple font-bold underline hover:text-white active:text-krispyPurple text-lg"
	>
		Edit
	</p>
	<!-- IMAGE INPUT -->
	<input
		tabindex="-1"
		type="file"
		name={input_name}
		accept="image/*"
		class="w-0 h-0 t absolute"
		on:change={handleFileChange}
		bind:this={uploadFile}
		bind:value={selectedImage}
	/>
</button>
