<script lang="ts">
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { PublicationBar } from '$components';
	import { LoginInHome } from '$components';
	import type { PageData } from './$types';

	export let data: PageData;
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
</script>

<div class="col-span-7">
	<div class="flex flex-col gap-y-4 mt-8">
		{#if isLogin}
			<PublicationBar user_url={'/profile'} user_photo_url={profile_photo} />
		{:else}
			<LoginInHome />
		{/if}
		{#await data.streamed?.posts}
			{#each Array(2) as _}
				<Post loading={true} />
			{/each}
		{:then posts}
			{#each posts as post}
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
		{/await}
	</div>
</div>
<div class="col-span-3">
	<div class="flex flex-col gap-y-2 items-start mt-24 sticky top-6 max-h-screen overflow-y-auto">
		<div class="bg-purpleGray rounded-2xl px-4 py-2.5 min-w-full">
			<h1 class="text-white font-bold text-lg">Welcome</h1>
			<p class="text-white">This is your home page. Checkout the new updates.</p>
		</div>
		{#await data.streamed?.top_tags}
			<Tops loading={true} />
		{:then tops}
			<Tops {tops} />
		{/await}
		<Footer />
	</div>
</div>
