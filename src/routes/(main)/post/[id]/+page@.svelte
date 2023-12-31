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

<div class="bg-purpleDark min-h-screen relative">
	<div
		class="grid sm:grid-cols-9 md:grid-cols-12 pr-[20px] md:pr-[20px] lg:pr-[40px] sm:gap-[20px] mx-auto relative"
	>
		<div class="col-span-9 h-screen sticky top-0">
			{#await data.streamed?.post}
				<PostDetail loading={true} />
			{:then post}
				<PostDetail
					post_thumbnail_url={post.thumbnail ? post.thumbnail : ''}
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
	</div>
</div>
