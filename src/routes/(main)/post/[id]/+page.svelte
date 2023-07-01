<script lang="ts">
	import PostDetail from '$components/PostDetail.component.svelte';
	import Comments from '$components/Comments.component.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: post = data.post;
  $: comments = data.comments;
	$: id = Number(data.id);
	$: my_reactions = data.my_reactions;
	$: profile_photo = data.profile_photo !== 'null' ? data.profile_photo : '';

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
	<!-- REVISAR -->
	<!-- post_by_tags_url -->
	<PostDetail
		user_photo_url={post.user.profile_photo}
		user_name={post.user.username}
		user_url="/profile/{post.user.id}"
		post_url="/post/{post.id}"
		post_content={post.content}
		post_thumbnail_url={post.thumbnail}
		publication_date={post.publication_date}
		like_on={handleLike(my_reactions, post.id)}
		likes_count={post.reactions.length}
		comments_count={comments.length}
		tags_count={post.tags.length}
		tags={post.tags.map((tag) => tag.content)}
		post_by_tags_url="/home"
		creator_id={post.user.id}
		myUser_id={id}
		post_id={post.id}
	/>
</div>

<div class="col-span-3 mt-8">
	<Comments comments={comments} my_user_photo={profile_photo} post_id={post.id} my_user_id={id} />
</div>
