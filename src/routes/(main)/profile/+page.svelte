<script lang="ts">
	import { CoverPhoto } from '$components';
	import { ProfilePhoto } from '$components';
	import { UserDescription } from '$components';
	import { Post } from '$components';
	import type { PageData } from './$types';

	export let data: PageData;
  $: plainMyUser = data.plainMyUser; 
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
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

{#await data.streamed?.myUser}
	<div class="col-start-3 col-span-9 block mt-8">
		<CoverPhoto loading={true} />
	</div>
	<div class="col-start-3 col-span-3">
		<div class="relative h-full w-full">
			<div class="absolute right-0 bottom-0">
				<ProfilePhoto loading={true} />
			</div>
		</div>
	</div>
	<div class="col-start-6 col-span-5">
		<UserDescription loading={true} />
	</div>
{:then user}
	<div class="col-start-3 col-span-9 block mt-8">
		<CoverPhoto coverPhotoUrl={user.cover_photo} editable={true} />
	</div>
	<div class="col-start-3 col-span-3">
		<div class="relative h-full w-full">
			<div class="absolute right-0 bottom-0">
				<ProfilePhoto profilePhoto={user.profile_photo} username={user.username} editable={true} />
			</div>
		</div>
	</div>
	<div class="col-start-6 col-span-5">
		<UserDescription
			content={user.description ? user.description : ''}
			webSite={user.personal_url}
			birthDay={user.birthday}
			location={user.location}
			userCreationDate={user.creation_date}
		/>
	</div>
{/await}

<div class="col-start-4 col-span-7 block mb-6">
	<div class="flex flex-col gap-y-8">
		{#await data.streamed?.myPosts}
			<Post loading={true} />
		{:then posts}
			{#if posts}
				{#each posts as post}
					<Post
						user_photo_url={post.user.profile_photo}
						user_name={post.user.username}
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
						creator_id={post.user.id}
						myUser_id={id}
						post_id={post.id}
					/>
				{/each}
			{:else}
				<div class="rounded-2xl bg-purpleGray w-full h-28 flex items-center justify-center mt-4">
					<p class="text-white opacity-70 font-bold text-lg w-fit">This seems pretty quiet ...</p>
				</div>
			{/if}
		{/await}
	</div>
</div>
