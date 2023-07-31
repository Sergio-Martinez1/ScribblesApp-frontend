<script lang="ts">
	import PostDetail from '$components/PostDetail.component.svelte';
	import Comments from '$components/Comments.component.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

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

<div class="col-span-7 mt-8 h-fit sticky">
	{#await data.streamed?.post}
		<PostDetail loading={true} />
	{:then post}
		<PostDetail
			user_photo_url={post.user.profile_photo}
			user_name={post.user.username}
			user_url="/profile/{post.user.id}"
			post_url="/post/{post.id}"
      post_content={post.content ? post.content : ''}
      post_thumbnail_url={post.thumbnail ? post.thumbnail : ''}
			publication_date={post.publication_date}
			like_on={handleLike(my_reactions, post.id)}
			likes_count={post.reactions.length}
			comments_count={post.num_comments}
			tags_count={post.tags.length}
			tags={post.tags.map((tag) => tag.content)}
			post_by_tags_url="/home"
			creator_id={post.user.id}
			myUser_id={id}
			post_id={post.id}
		/>
	{/await}
</div>

<div class="col-span-3 mt-8">
	{#await data.streamed?.comments}
		<Comments loading={true} />
	{:then comments}
		<Comments
			{comments}
			{isLogin}
			my_user_photo={profile_photo}
			post_id={Number($page.params.id)}
			my_user_id={id}
		/>
	{/await}
</div>
