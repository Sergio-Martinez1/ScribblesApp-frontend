<script lang="ts">
	import { CoverPhoto } from '$components';
	import { ProfilePhoto } from '$components';
	import { UserDescription } from '$components';
	import { Post } from '$components';

	import type { PageData } from './$types';
	export let data: PageData;
	$: user = data.user;
	$: posts = data.posts;
	$: id = Number(data.id);
  $: my_reactions = data.my_reactions;
  
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

<div class="col-span-9">
	<div class="flex flex-col gap-y-6 mt-8 mb-6">
		<div class="relative">
			<CoverPhoto coverPhotoUrl={user.cover_photo} editable={false} />
			<div class="absolute top-[206px] left-[49px]">
				<ProfilePhoto profilePhoto={user.profile_photo} username={user.username} editable={false} />
			</div>
		</div>
		<div class="ml-60">
			<UserDescription
				content={user.description}
				webSite={user.personal_url}
				birthDay={user.birthday}
				location={user.location}
				userCreationDate={user.creation_date}
			/>
		</div>
	</div>
	<div class="flex flex-col gap-y-8">
		{#each posts as post}
			<!-- REVISAR -->
			<!-- like_on -->
			<!-- post_by_tags_url -->
			<!-- myUser_id -->
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
