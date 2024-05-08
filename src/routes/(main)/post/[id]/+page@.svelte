<script lang="ts">
	import PostDetail from '$components/PostDetail.component.svelte';
	import Comments from '$components/Comments.component.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
  
  //FALTA IMPLEMENTAR LAS REACCIONES

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

<div class="bg-purpleDark min-h-screen relative">
	<div class="grid grid-cols-9 lg:grid-cols-12 lg:pr-[40px] lg:gap-[20px] mx-auto relative">
		<div class="col-span-9 h-screen lg:sticky lg:top-0">
			{#await data.streamed?.post}
				<PostDetail loading={true} />
			{:then post}
				{#if post?.status === 200 && post.data}
					<PostDetail
						post_thumbnail_url={post.data.thumbnail ? post.data.thumbnail : ''}
						post_content={post.data.content}
						post_creation_date={post.data.publication_date}
						user_photo_url={post.data.user.profile_photo}
						user_name={post.data.user.username}
						post_id={post.data.id}
					/>
				{:else if post?.status === 404}
					<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
						<p class="text-white">Post Not found</p>
					</div>
				{:else}
					<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
						<p class="text-white">Please reload the page</p>
					</div>
				{/if}
			{/await}
		</div>

		<div class="col-span-9 px-5 mt-4 lg:px-0 lg:col-span-3 lg:mt-8">
			{#await data.streamed?.comments}
				<Comments loading={true} />
			{:then comments}
				{#if comments?.status === 200 && comments.data}
					<Comments
            comments={comments.data}
						{isLogin}
						my_user_photo={profile_photo}
						post_id={Number($page.params.id)}
						my_user_id={id}
					/>
				{:else if comments?.status === 404}
					<div class="bg-purpleGray rounded-2xl flex justify-center p-3">
						<p class="text-white">Comments Not found</p>
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
