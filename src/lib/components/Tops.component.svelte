<script lang="ts">
	import type { TopTag } from '$lib/types';
	export let tops: TopTag[] = [];
	export let loading: boolean = false;
</script>

<div
	class="px-4 py-2.5 flex flex-col items-start gap-y-2 bg-lavandaGray dark:bg-purpleGray rounded-2xl m-auto max-h-fit min-w-full"
>
	{#if loading}
		<div class="animate-pulse bg-lavandaLight dark:bg-purpleLight rounded-2xl w-32 h-6" />
		<div class="flex flex-col items-start gap-y-2.5 w-full">
			{#each Array(3) as _}
				<div class="animate-pulse bg-lavandaLight dark:bg-purpleLight rounded-2xl w-full h-10 py-2 pl-4" />
			{/each}
		</div>
	{:else}
		<h1 class="dark:text-white text-lg font-bold">On time for</h1>
		<div class="flex flex-col items-start gap-y-2.5 min-w-full">
			{#each tops as top}
				<div class="flex flex-col items-start bg-lavandaLight dark:bg-purpleLight rounded-2xl w-full py-2 pl-4">
					<a href="/home/{top.content}">
						<h1 class="dark:text-white font-bold text-lg">#{top.content}</h1>
					</a>
					<p class="dark:text-white">{top.count} Posts</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
