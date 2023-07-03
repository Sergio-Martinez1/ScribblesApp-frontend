<script lang="ts">
  import type { TopTag } from "$lib/types";
	export let tops: TopTag[] = [];
</script>

<div
	class="p-2.5 flex flex-col items-start gap-y-2 bg-purpleGray rounded-2xl m-auto max-h-fit min-w-full"
>
	<h1 class="text-white text-lg font-bold">On time for</h1>
	<div class="flex flex-col items-start gap-y-2.5 min-w-full">
		{#each tops as top}
		<div class="flex flex-col items-start bg-purpleLight rounded-2xl w-full py-2 pl-4">
			<h1 class="text-white font-bold text-lg">#{top.content}</h1>
			<p class="text-white">{top.count} Posts</p>
		</div>
		{/each}
	</div>
</div>
