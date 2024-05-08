<script lang="ts">
	import { CoverPhoto } from '$components';
	import { ProfilePhoto } from '$components';
	import { UserDescription } from '$components';
	import { Post } from '$components';
	import { onDestroy, onMount, tick } from 'svelte';
	import { fetchPosts } from '$lib/utils/infiniteScroll';
	import type { PageData } from './$types';
	import type { Post as TypePost } from '$lib/types';

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
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
	$: my_reactions = 'my_reactions' in data ? data.my_reactions : null;
	$: url = `http://localhost:5173/api/posts/myPosts?offset=${offset}&limit=${limit}`;

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
		tick().then(() => {
			if (loadingPostsElement) {
				observer?.observe(loadingPostsElement);
			}
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

<div class="col-span-7 md:col-span-10 md:grid sm:col-start-3 md:gapx-[20px] md:grid-cols-10">
	{#await data.streamed?.myUser}
		<div class="col-span-10 lg:col-span-9 mt-8">
			<CoverPhoto loading={true} />
		</div>
		<div
			class="flex flex-col col-span-10 lg:grid grid-cols-7 md:grid-cols-10 my-4 lg:h-[160px] overflow-visible"
		>
			<div class="md:col-span-4 lg:col-span-3 w-full h-[80px] sm:h-[160px] flex justify-center">
				<div
					class="w-full h-fit flex flex-col items-center justify-center self-end relative bottom-5 md:bottom-8"
				>
					<ProfilePhoto loading={true} />
				</div>
			</div>
			<div class="md:col-span-6 flex items-center h-full">
				<UserDescription loading={true} />
			</div>
		</div>
	{:then user}
		{#if user?.status === 200 && user.data}
			<div class="col-span-10 lg:col-span-9 mt-8">
				<CoverPhoto coverPhotoUrl={user.data?.cover_photo} editable={true} />
			</div>
			<div
				class="flex flex-col col-span-10 lg:grid grid-cols-7 md:grid-cols-10 my-4 lg:h-[160px] overflow-visible"
			>
				<div class="md:col-span-4 lg:col-span-3 w-full h-[80px] sm:h-[160px] flex justify-center">
					<div
						class="w-full h-fit flex flex-col items-center justify-center self-end relative bottom-5 md:bottom-8"
					>
						<ProfilePhoto
							profilePhoto={user.data.profile_photo}
							username={user.data.username}
							editable={true}
						/>
					</div>
				</div>

				<div class="md:col-span-6 flex items-center h-full">
					<UserDescription
						content={user.data.description}
						webSite={user.data.personal_url}
						birthDay={user.data.birthday}
						location={user.data.location}
						userCreationDate={user.data.creation_date}
					/>
				</div>
			</div>
		{:else}
			<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
				<p class="text-white">Please reload the page</p>
			</div>
		{/if}
	{/await}

	<div
		class="col-start-1 col-span-9 md:col-start-1 lg:col-start-2 md:col-span-10 lg:col-span-7 block mb-28 sm:mb-6"
	>
		<div class="flex flex-col gap-y-8">
			{#await data.streamed?.myPosts}
				<Post loading={true} />
			{:then myPosts}
				{#if myPosts?.status === 200 && myPosts.data}
					{#each myPosts.data as post}
						<Post
							user_photo_url={post.user.profile_photo}
							user_name={post.user.username}
							user_url="/profile/{post.user.id}"
							post_url="/post/{post.id}"
							publication_date={post.publication_date}
							post_content={post.content ? post.content : ''}
							post_thumbnail_url={post.thumbnail ? post.thumbnail : ''}
							like_on={handleLike(my_reactions, post.id)}
							likes_count={post.reactions ? post.reactions.length : 0}
							comments_count={post.num_comments ? post.num_comments : 0}
							tags_count={post.tags ? post.tags.length : 0}
							vertical={false}
							tags={post.tags ? post.tags.map((tag) => tag.content) : []}
							post_by_tags_url="/home"
							creator_id={post.user.id}
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
							likes_count={post.reactions ? post.reactions.length : 0}
							comments_count={post.num_comments ? post.num_comments : 0}
							tags_count={post.tags ? post.tags.length : 0}
							vertical={false}
							tags={post.tags ? post.tags.map((tag) => tag.content) : []}
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
							Please reload the page
						</div>
					{/if}
				{:else if myPosts?.status === 404}
					<div class="w-full rounded-2xl bg-purpleGray flex items-center justify-center h-20">
						<p class="text-white opacity-60">This seems a little quiet...</p>
					</div>
				{:else}
					<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
						<p class="text-white">Please reload the page</p>
					</div>
				{/if}
			{/await}
		</div>
	</div>
</div>
