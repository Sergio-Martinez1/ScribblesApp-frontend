<script lang="ts">
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { LoginInHome } from '$components';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import type { Post as TypePost } from '$lib/types';
	import { fetchPosts } from '$lib/utils/infiniteScroll';
	import { onDestroy, onMount, tick } from 'svelte';

	export let data: PageData;
	let scrollData: Array<TypePost> = [];
	let loadingPostsElement: HTMLElement | null;
	let offset: number = 20;
	let limit: number = 10;
	let infiniteScrollData: { data: Array<TypePost> | null; status: number } = {
		data: null,
		status: 200
	};
	let observer: IntersectionObserver;

	$: plainMyUser = data.plainMyUser;
	$: isLogin = plainMyUser ? true : false;
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
	$: my_reactions = 'my_reactions' in data ? data.my_reactions : null;
	$: url = `http://localhost:5173/api/posts/tags/${$page.params.tag}?offset=${offset}&limit=${limit}`;
	$: {
		if ($page.params.tag) {
			scrollData = [];
			offset = 10;
		}
	}
	$: {
		if (loadingPostsElement) {
			tick().then(() => {
				if (loadingPostsElement) {
					observer?.observe(loadingPostsElement);
				}
			});
		}
	}

	onMount(async () => {
		observer = new IntersectionObserver(async (entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting) {
					infiniteScrollData = await fetchPosts(url);
					if (infiniteScrollData.data) {
						scrollData = [...scrollData, ...infiniteScrollData.data];
						offset += 10;
					}
				}
			});
		});
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	function handleLike(my_reactions: any[], post_id: number) {
		if (my_reactions) {
			let reaction_exits = my_reactions.filter((reaction) => reaction.post_id == post_id);
			if (reaction_exits.length > 0) {
				return true;
			}
		}
		return false;
	}
</script>

<div class="col-span-7">
	<div class="flex flex-col gap-y-4 my-8">
		<p class="text-white text-3xl my-3">
			Posts related to: <span class="font-bold text-4xl ml-2">{$page.params.tag}</span>
		</p>
		{#if !isLogin}
			<LoginInHome />
		{/if}
		{#await data.streamed?.posts}
			{#each Array(2) as _}
				<Post loading={true} />
			{/each}
		{:then posts}
			{#if posts?.status === 200 && posts.data}
				{#each posts.data as post}
					<Post
						user_photo_url={post.user?.profile_photo}
						user_name={post.user?.username}
						user_url="/profile/{post.user.id}"
						post_url="/post/{post.id}"
						publication_date={post.publication_date}
						post_content={post.content ? post.content : ''}
						post_thumbnail_url={post.thumbnail ? post.thumbnail : ''}
						like_on={handleLike(my_reactions, post.id)}
						likes_count={post.reactions.length}
						comments_count={post.num_comments}
						tags_count={post.tags.length}
						vertical={false}
						tags={post.tags.map((tag) => tag.content)}
						post_by_tags_url="/home"
						creator_id={post.user?.id}
						myUser_id={id}
						post_id={post.id}
					/>
				{/each}
				{#each scrollData as post}
					<Post
						user_photo_url={post.user?.profile_photo}
						user_name={post.user?.username}
						user_url="/profile/{post.user.id}"
						post_url="/post/{post.id}"
						publication_date={post.publication_date}
						post_content={post.content ? post.content : ''}
						post_thumbnail_url={post.thumbnail ? post.thumbnail : ''}
						like_on={handleLike(my_reactions, post.id)}
						likes_count={post.reactions.length}
						comments_count={post.num_comments}
						tags_count={post.tags.length}
						vertical={false}
						tags={post.tags.map((tag) => tag.content)}
						post_by_tags_url="/home"
						creator_id={post.user?.id}
						myUser_id={id}
						post_id={post.id}
					/>
				{/each}
				{#if infiniteScrollData.status == 200}
					<div bind:this={loadingPostsElement}>
						<Post loading={true} />
					</div>
					<Post loading={true} />
				{:else if infiniteScrollData.status == 404}
					<div
						class="w-full bg-purpleGray text-white justify-center rounded-2xl flex items-center h-10"
					>
						No more posts to see...
					</div>
				{:else}
					<div class="w-full bg-purpleLight text-white flex justify-center rounded-full">
						PLEASE RELOAD
					</div>
				{/if}
			{:else if posts?.status === 404}
				<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
					<p class="text-white">You arrived at the end</p>
				</div>
			{:else}
				<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
					<p class="text-white">Please reload the page</p>
				</div>
			{/if}
		{/await}
	</div>
</div>
<div class="col-span-3 hidden md:inline-block">
	<div class="flex flex-col gap-y-2 items-start mt-24 sticky top-6 max-h-screen">
		<div class="bg-purpleGray rounded-2xl px-4 py-2.5 min-w-full">
			<h1 class="text-white font-bold text-lg">Welcome</h1>
			<p class="text-white">This is your home page. Checkout the new updates.</p>
		</div>
		{#await data.streamed.top_tags}
			<Tops loading={true} />
		{:then tops}
			{#if tops?.status === 200 && tops.data}
				<Tops tops={tops.data} />
			{:else if tops?.status === 404}
				<div class="bg-purpleGray rounded-2xl flex justify-center p-3 w-full">
					<p class="text-white">No tendencies right now</p>
				</div>
			{:else}
				<div class="bg-purpleGray rounded-2xl flex justify-center p-3 w-full">
					<p class="text-white">Please reload the page</p>
				</div>
			{/if}
		{/await}
		<Footer />
	</div>
</div>
