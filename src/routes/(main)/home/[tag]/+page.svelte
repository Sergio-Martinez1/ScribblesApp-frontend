<script lang="ts">
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { LoginInHome } from '$components';
	import { page } from '$app/stores';
	import { onDestroy, onMount, tick } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { invalidate, onNavigate } from '$app/navigation';
	import session from '../../../../stores/session';
	import type { ActionData, PageData } from './$types';
	import type { Post as TypePost } from '$lib/types';

	//DATA FROM API AND FORM ACTIONS
	export let data: PageData;
	export let form: ActionData;

	//Posts logic
	let posts: Array<TypePost> = [];
	let isLoading: boolean = true;
	let error: number = 0;
	let loadingPostsElement: HTMLElement | null;
	let observer: IntersectionObserver;

	$: plainMyUser = data.plainMyUser;
	$: isLogin = plainMyUser ? true : false;
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
	$: my_reactions = data.myReactions;
	$: url = `${env.PUBLIC_SERVER_API_URL}/api/posts/tags/${$page.params.tag}?offset=${$session.homeWithTag.offset}&limit=${$session.homeWithTag.limit}`;

	$: {
		if ($page.params.tag) {
			// $session.homeWithTag.posts = [];
			// $session.homeWithTag.scrollY = 0;
			$session.homeWithTag.limit = 5;
			$session.homeWithTag.offset = 0;
			posts = [];
		}
	}

	async function loadPosts() {
		isLoading = true;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				if (data.status == 200) {
					// $session.homeWithTag.posts = [...$session.homeWithTag.posts, ...data.data];
					// $session.homeWithTag.offset += 5;
					posts = [...posts, ...data.data];
				} else if (data.status == 404) {
					error = 404;
					isLoading = false;
				} else if (data.status == 500) {
					error = 500;
					isLoading = false;
				}
			})
			.catch(() => {
				error = 500;
				isLoading = false;
			});
	}

	function handleLike(my_reactions: any[], post_id: number) {
		if (my_reactions) {
			let reaction_exits = my_reactions.filter((reaction) => reaction.post_id == post_id);
			if (reaction_exits.length > 0) {
				return true;
			}
		}
		return false;
	}

	function handleRemovePost(event: CustomEvent) {
		posts = posts.filter((post: TypePost) => post.id !== event.detail.id);
		// $session.homeWithTag.posts = $session.homeWithTag.posts.filter(
		// 	(post: TypePost) => post.id !== event.detail.id
		// );
	}

	function handleUpdatePost(event: CustomEvent) {
		posts = posts.map((post: TypePost) => {
			if (post.id === event.detail.id) {
				return event.detail;
			}
			return post;
		});
	}

	function handleDontShowPost(event: CustomEvent) {
		posts = posts.filter((post: TypePost) => post.id !== event.detail.id);
		// $session.homeWithTag.posts = $session.homeWithTag.posts.filter(
		// 	(post: TypePost) => post.id !== event.detail.id
		// );
	}

	onMount(async () => {
		invalidate('plainUser');
		invalidate('myReactions');

		await loadPosts();
		// if ($session.homeWithTag.posts.length === 0) {
		// 	await loadPosts();
		// } else {
		// 	posts = $session.homeWithTag.posts;
		// }

		observer = new IntersectionObserver(async (entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting) {
					loadPosts();
				}
			});
		});

		tick().then(() => {
			scrollTo(0, $session.homeWithTag.scrollY);
			if (loadingPostsElement) {
				observer?.observe(loadingPostsElement);
			}
		});
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	// onNavigate(() => {
	// 	if ($session.homeWithTag.posts.length >= 40) {
	// 		$session.homeWithTag.posts = [];
	// 		$session.homeWithTag.scrollY = 0;
	// 		$session.homeWithTag.limit = 5;
	// 		$session.homeWithTag.offset = 0;
	// 		isLoading = true;
	// 		posts = [];
	// 	} else {
	// 		$session.homeWithTag.scrollY = window.scrollY;
	// 	}
	// });
</script>

<main class="col-span-7">
	<div class="flex flex-col gap-y-4 mt-4 mb-24 sm:my-8">
		<p class="dark:text-white text-3xl my-3">
			Posts related to: <span class="font-bold text-4xl ml-2">{$page.params.tag}</span>
		</p>
		{#if !isLogin}
			<LoginInHome />
		{/if}

		<!-- POSTS -->
		{#if posts.length !== 0}
			<!-- IF SUCCES LOAD POSTS FROM API -->
			{#each posts as post}
				<div class="post-element">
					<Post
						{form}
						on:updatepost={handleUpdatePost}
						on:deletepost={handleRemovePost}
						on:dontshowpost={handleDontShowPost}
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
				</div>
			{/each}
		{/if}

		{#if isLoading}
			<!-- IF NOT SESSION, AWAIT -->
			<div bind:this={loadingPostsElement}>
				<Post loading={true} {form} />
			</div>
		{:else if error == 404}
			<!-- IF ERROR -->
			<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex justify-center p-3">
				<p class="dark:text-white">No more posts to see...</p>
			</div>
		{:else if error == 500}
			<!-- IF ERROR -->
			<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex justify-center p-3">
				<p class="dark:text-white">Please reload the page</p>
			</div>
		{/if}
	</div>
</main>

<aside class="col-span-3 hidden md:inline-block">
	<section class="flex flex-col gap-y-2 items-start mt-24 sticky top-6 max-h-screen">
		<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl px-4 py-2.5 min-w-full">
			<h1 class="dark:text-white font-bold text-lg">Welcome</h1>
			<p class="dark:text-white">This is your home page. Checkout the new updates.</p>
		</div>
		{#await data.streamed.top_tags}
			<Tops loading={true} />
		{:then tops}
			{#if tops?.status === 200 && tops.data}
				<Tops tops={tops.data} />
			{:else if tops?.status === 404}
				<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex justify-center p-3 w-full">
					<p class="dark:text-white">No tendencies right now</p>
				</div>
			{:else}
				<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex justify-center p-3 w-full">
					<p class="dark:text-white">Please reload the page</p>
				</div>
			{/if}
		{/await}
		<Footer />
	</section>
</aside>
