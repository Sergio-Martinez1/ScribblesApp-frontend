<script lang="ts">
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { PublicationBar } from '$components';
	import { LoginInHome } from '$components';
	import type { PageData } from './$types';

	export let data: PageData;
	$: posts = data.posts;
	$: top_tags = data.top_tags;
	$: isLogin = data.username ? true : false;
	$: id = Number(data.id);
	$: my_reactions = data.my_reactions;
	$: profile_photo = data.profile_photo;

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
	<div class="flex flex-col gap-y-4 mt-8">
		{#if isLogin}
			<PublicationBar user_url={'/profile'} user_photo_url={profile_photo} />
		{:else}
			<LoginInHome />
		{/if}
		{#each posts as post}
			<!-- REVISAR -->
			<!-- post_by_tags_url -->
			<Post
				user_photo_url={post.user.profile_photo}
				user_name={post.user.username}
				user_url="/profile/{post.user.id}"
				post_url="/post/{post.id}"
				publication_date={post.publication_date}
				post_content={post.content}
				post_thumbnail_url={post.thumbnail}
				like_on={handleLike(my_reactions, post.id)}
				likes_count={post.reactions.length}
				comments_count={post.num_comments}
				tags_count={post.tags.length}
				vertical={false}
				tags={post.tags.map((tag) => tag.content)}
				post_by_tags_url="/home"
				creator_id={post.user.id}
				myUser_id={id}
				post_id={post.id}
			/>
		{/each}
	</div>
</div>
<div class="col-span-3">
	<div class="flex flex-col gap-y-2 items-start mt-32 sticky top-1 max-h-screen overflow-y-auto">
		<div class="bg-purpleGray rounded-2xl px-2.5 py-2.5 min-w-full">
			<h1 class="text-white font-bold text-lg">Welcome</h1>
			<p class="text-white">This is your home page. Checkout the new updates.</p>
		</div>
		<Tops
			top_one={top_tags[0].content}
			top_two={top_tags[1].content}
			top_three={top_tags[2].content}
		/>
		<Footer />
	</div>
</div>
