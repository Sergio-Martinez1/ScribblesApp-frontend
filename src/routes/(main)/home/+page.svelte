<script lang="ts">
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { PublicationBar } from '$components';
	import { LoginInHome } from '$components';
	import type { PageData } from './$types';
	import { infiniteScroll } from '$lib/utils/infiniteScroll';

	export let data: PageData;
	let scrollPosts: Array<any> = [];
	let loadingPosts: boolean = false;
	let loadingPostsElement: HTMLElement | null = null;
	let loadingPostsStatus: number = 200;
	let offset: number = 20;
	let limit: number = 10;

	$: plainMyUser = data.plainMyUser;
	$: isLogin = plainMyUser ? true : false;
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
	$: profile_photo =
		plainMyUser && plainMyUser.profile_photo !== 'null' ? plainMyUser.profile_photo : '';
	$: my_reactions = 'my_reactions' in data ? data.my_reactions : null;

	function handleLike(my_reactions: any[], post_id: number) {
		if (my_reactions) {
			let reaction_exits = my_reactions.filter((reaction) => reaction.post_id == post_id);
			if (reaction_exits.length > 0) {
				return true;
			}
		}
		return false;
	}

	const fetchPosts = async (offset: number, limit: number) => {
		try {
			loadingPosts = true;
			const url = `http://localhost:5173/api/posts?offset=${offset}&limit=${limit}`;
			const options = { method: 'GET' };
			const response = await fetch(url, options);
			if (response.ok) {
				loadingPostsStatus = 200;
				const posts = await response.json();
				scrollPosts = [...scrollPosts, ...posts];
				loadingPosts = false;
				return offset + 10;
			} else if (response.status == 404) {
				loadingPostsStatus = 404;
			} else {
				loadingPostsStatus = response.status;
			}
		} catch (error) {
			loadingPostsStatus = 500;
		}
		return offset;
	};

	const waitingLoadingPost = () => {
		setTimeout(async () => {
			offset = await fetchPosts(offset, limit);
		}, 300);
	};

	$: {
		if (loadingPostsElement) {
			infiniteScroll({ fetch: waitingLoadingPost, element: loadingPostsElement });
		}
	}
	$: console.log(offset);
</script>

<div class="col-span-7">
	<div class="flex flex-col gap-y-4 mt-4 max-sm:mb-24 sm:mt-8">
		{#if isLogin}
			<PublicationBar user_url={'/profile'} user_photo_url={profile_photo} />
		{:else}
			<LoginInHome />
		{/if}
		{#await data.streamed.posts}
			{#each Array(2) as _}
				<Post loading={true} />
			{/each}
		{:then posts}
			{#if posts?.status === 200}
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
				{#each scrollPosts as post}
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
				{#if loadingPostsStatus == 200}
					<div bind:this={loadingPostsElement}>
						<Post loading={true} />
					</div>
					<Post loading={true} />
				{:else if loadingPostsStatus == 404}
					<div class="w-full bg-purpleLight text-white justify-center">NOT FOUND</div>
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
			{#if tops?.status === 200}
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
