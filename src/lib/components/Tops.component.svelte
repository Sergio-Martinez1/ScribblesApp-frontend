<script lang="ts">
	export let top_one: string = '';
	export let top_two: string = '';
	export let top_three: string = '';
</script>

<div
	class="p-2.5 flex flex-col items-start gap-y-2 bg-purpleGray rounded-2xl m-auto max-h-fit min-w-full"
>
	<h1 class="text-white text-lg font-bold">On time for</h1>
	<div class="flex flex-col items-start gap-y-2.5 min-w-full">
		<div class="flex flex-col items-start bg-purpleLight rounded-2xl w-full py-2 pl-4">
			<h1 class="text-white font-bold text-lg">#{top_one}</h1>
			<p class="text-white">1,2K Posts</p>
		</div>
		<div class="flex flex-col items-start bg-purpleLight rounded-2xl w-full py-2 pl-4">
			<h1 class="text-white font-bold text-lg">#{top_two}</h1>
			<p class="text-white">1,2K Posts</p>
		</div>
		<div class="flex flex-col items-start bg-purpleLight rounded-2xl w-full py-2 pl-4">
			<h1 class="text-white font-bold text-lg">#{top_three}</h1>
			<p class="text-white">1,2K Posts</p>
		</div>
	</div>
</div>
