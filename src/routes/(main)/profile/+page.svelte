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
		<div class="col-span-10 lg:col-span-9 mt-8">
			<CoverPhoto coverPhotoUrl={user.cover_photo} editable={true} />
		</div>
		<div
			class="flex flex-col col-span-10 lg:grid grid-cols-7 md:grid-cols-10 my-4 lg:h-[160px] overflow-visible"
		>
			<div class="md:col-span-4 lg:col-span-3 w-full h-[80px] sm:h-[160px] flex justify-center">
				<div
					class="w-full h-fit flex flex-col items-center justify-center self-end relative bottom-5 md:bottom-8"
				>
					<ProfilePhoto
						profilePhoto={user.profile_photo}
						username={user.username}
						editable={true}
					/>
				</div>
			</div>

			<div class="md:col-span-6 flex items-center h-full">
				<UserDescription
					content={user.description}
					webSite={user.personal_url}
					birthDay={user.birthday}
					location={user.location}
					userCreationDate={user.creation_date}
				/>
			</div>
		</div>
	{/await}

	<div
		class="col-start-1 col-span-9 md:col-start-1 lg:col-start-2 md:col-span-10 lg:col-span-7 block mb-28 sm:mb-6"
	>
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
				{/if}
			{/await}
		</div>
	</div>
</div>
