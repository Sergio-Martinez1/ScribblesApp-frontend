<script lang="ts">
	import Comments from '$components/Comments.component.svelte';
	import CommentPublicactionBar from '$components/CommentPublicactionBar.component.svelte';
	import settings from '../../../../stores/settings';
	import { afterNavigate, goto } from '$app/navigation';
	import { Logo } from '$components/Icon';
	import ArrowLeft from '$components/Icon/ArrowLeft.svelte';
	import PostDetailDescription from '$components/PostDetailDescription.componente.svelte';
	import PostDetailThumbnail from '$components/PostDetailThumbnail.component.svelte';
	import PostDetailReactions from '$components/PostDetailReactions.component.svelte';
	import InsatisfiedFace from '$components/Icon/InsatisfiedFace.svelte';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: plainMyUser = data.plainMyUser;
	$: id = plainMyUser && plainMyUser.id ? Number(plainMyUser.id) : -1;
	$: profile_photo =
		plainMyUser && plainMyUser.profile_photo !== 'null' ? plainMyUser.profile_photo : '';
	$: myReactions = data.myReactions;

	afterNavigate(({ from }) => {
		$settings.previousPage = from?.url.toString() || '';
	});

	const navigateTo = (url: string) => {
		goto(url, { noScroll: true, invalidateAll: false });
	};

	function handleLike(my_reactions: any[], post_id: number | undefined) {
		if (my_reactions) {
			let reaction_exits = my_reactions.filter((reaction) => reaction.post_id == post_id);
			if (reaction_exits.length > 0) {
				return true;
			}
		}
		return false;
	}
</script>

{#await data.streamed.post}
	<div
		class="min-h-screen bg-lavandaDark dark:bg-purpleDark pb-[81px] md:pb-0 md:pt-[61px] md:realtive md:h-screen md:grid md:grid-cols-[1fr_360px]"
	>
		<header
			class="h-fit py-2 bg-lavandaGray dark:bg-purpleGray md:fixed md:top-0 md:w-full md:z-50"
		>
			<nav class="grid grid-cols-[70px_1fr_70px] h-[45px]">
				{#if $settings.previousPage.length}
					<button
						on:click={() => {
							navigateTo($settings.previousPage);
						}}
						class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-br-3xl rounded-tr-3xl w-10 h-[45px] flex items-center justify-center"
						><ArrowLeft width={30} height={30} /></button
					>
				{:else}
					<a href="/home" class="justify-self-center"><Logo width={45} height={45} /></a>
				{/if}
				<div
					class="w-[105px] h-[25px] self-center justify-self-center bg-lavandaLight dark:bg-purpleLight rounded-full animate-pulse"
				></div>
			</nav>
		</header>
		<main class="h-full">
			<PostDetailThumbnail isLoading={true} />
			<section class="md:hidden overflow-scroll">
				<PostDetailDescription isLoading={true} {form} />
				<PostDetailReactions {form} />
				<Comments isLoading={true} />
			</section>
		</main>
		<aside class="hidden md:inline-block overflow-y-auto pb-[79px] relative">
			<PostDetailDescription isLoading={true} {form} />
			<PostDetailReactions {form} />
			<Comments isLoading={true} />
			<div class="hidden md:inline-block fixed bottom-0 w-[360px]">
				<CommentPublicactionBar isLoading={true} />
			</div>
		</aside>
		<footer class="md:hidden fixed bottom-0 w-full bg-lavandaGray dark:bg-purpleGray px-4 py-3">
			<CommentPublicactionBar isLoading={true} />
		</footer>
	</div>
{:then postData}
	{#if postData?.status !== 200}
		<div class="min-h-screen bg-lavandaDark dark:bg-purpleDark">
			<header class="w-full h-fit py-2 bg-lavandaGray dark:bg-purpleGray fixed">
				<nav class="grid grid-cols-[70px_1fr_70px] h-[45px]">
					{#if $settings.previousPage.length}
						<button
							on:click={() => {
								navigateTo($settings.previousPage);
							}}
							class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-br-3xl rounded-tr-3xl w-10 h-[45px] flex items-center justify-center"
							><ArrowLeft width={30} height={30} /></button
						>
					{:else}
						<a href="/home" class="justify-self-center"><Logo width={45} height={45} /></a>
					{/if}
					<span class="font-bold self-center justify-self-center dark:text-white">Scribbles</span>
				</nav>
			</header>
			<main class="h-screen w-full flex flex-col items-center justify-center">
				<div class="opacity-40">
					<InsatisfiedFace
						width={60}
						height={60}
						tailwindFillClass={'fill-black dark:fill-white'}
					/>
				</div>
				{#if postData?.status === 404}
					<span class="opacity-40 font-bold dark:text-white px-4 text-center">
						Post not found, please return to Home page.
					</span>
				{:else}
					<span class="opacity-40 font-bold dark:text-white px-4 text-center">
						An unexpected has ocurred, please return to Home page.
					</span>
				{/if}
			</main>
		</div>
	{:else}
		{@const post = postData.data}
		{@const post_thumbnail = postData.data?.thumbnail}
		<div
			class="min-h-screen bg-lavandaDark dark:bg-purpleDark pb-[81px] md:pb-0 md:pt-[61px] md:realtive md:h-screen grid max-md:grid-rows-[61px_1fr] grid-cols-[1fr] {post_thumbnail
				? 'md:grid-cols-[1fr_360px]'
				: 'md:grid-cols-[550px] justify-center'}"
		>
			<header
				class="h-fit py-2 bg-lavandaGray dark:bg-purpleGray md:fixed md:top-0 md:w-full md:z-50 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
			>
				<nav class="grid grid-cols-[70px_1fr_70px] h-[45px]">
					{#if $settings.previousPage.length}
						<button
							on:click={() => {
								navigateTo($settings.previousPage);
							}}
							class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-br-3xl rounded-tr-3xl w-10 h-[45px] flex items-center justify-center"
							><ArrowLeft width={30} height={30} /></button
						>
					{:else}
						<a href="/home" class="justify-self-center"><Logo width={45} height={45} /></a>
					{/if}
					<span class="font-bold self-center justify-self-center dark:text-white"
						>{post?.user.username}'s post</span
					>
				</nav>
			</header>
			<main
				class="bg-lavandaGray dark:bg-purpleGray shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)] md:rounded-2xl {post_thumbnail
					? ''
					: 'my-2 md:m-2'}"
			>
				<div class="{post_thumbnail ? '' : 'hidden'} md:h-full">
					<PostDetailThumbnail post_thumbnail_url={post_thumbnail} />
				</div>
				<section class="md:{post_thumbnail ? 'hidden' : ''} overflow-y-auto md:rounded-2xl">
					<PostDetailDescription
						{form}
						post_id={post?.id}
						post_creation_date={post?.publication_date}
						user_photo_url={post?.user.profile_photo}
						user_name={post?.user.username}
						tags={post?.tags}
						post_thumbnail_url={post?.thumbnail}
						post_content={post?.content}
						creator_id={post?.user.id}
						myUser_id={id}
						dont_show_dialog_id={`dontShowPostDetailDialog-${post?.id}-mobile`}
						edit_dialog_id={`editPostDetailDialog-${post?.id}-mobile`}
						delete_dialog_id={`deletePostDetailDialog-${post?.id}-mobile`}
					/>
					<PostDetailReactions
						like_on={handleLike(myReactions, post?.id)}
						likes_count={post?.reactions ? post?.reactions.length : 0}
						comments_count={post?.num_comments ? post?.num_comments : 0}
						tags_count={post?.tags ? post?.tags.length : 0}
						post_url="/post/{post?.id}"
						tags={post?.tags ? post?.tags.map((tag) => tag?.content) : []}
						post_by_tags_url="/home"
						post_id={post?.id}
						my_user_id={id}
						{form}
					/>
					{#await data.streamed.comments}
						<Comments isLoading={true} />
					{:then commentsData}
						<Comments
							comments={commentsData.data}
							my_user_id={id}
							uniqueIdentifier={'mobile'}
							post_id={post?.id}
						/>
					{/await}
					<footer
						class="fixed bottom-0 w-full md:w-[534px] bg-lavandaGray dark:bg-purpleGray px-4 py-3 md:rounded-b-2xl md:mb-2"
					>
						<CommentPublicactionBar my_user_photo={profile_photo} post_id={post?.id} />
					</footer>
				</section>
			</main>
			<aside
				class="hidden md:{post_thumbnail
					? 'inline-block'
					: 'hidden'} overflow-y-auto pb-[79px] relative rounded-2xl m-2 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)] bg-lavandaGray dark:bg-purpleGray"
			>
				<PostDetailDescription
					{form}
					post_id={post?.id}
					post_creation_date={post?.publication_date}
					user_photo_url={post?.user.profile_photo}
					user_name={post?.user.username}
					tags={post?.tags}
					post_thumbnail_url={post?.thumbnail}
					post_content={post?.content}
					creator_id={post?.user.id}
					myUser_id={id}
					dont_show_dialog_id={`dontShowPostDetailDialog-${post?.id}-desktop`}
					edit_dialog_id={`editPostDetailDialog-${post?.id}-desktop`}
					delete_dialog_id={`deletePostDetailDialog-${post?.id}-desktop`}
				/>
				<PostDetailReactions
					like_on={handleLike(myReactions, post?.id)}
					likes_count={post?.reactions ? post?.reactions.length : 0}
					comments_count={post?.num_comments ? post?.num_comments : 0}
					tags_count={post?.tags ? post?.tags.length : 0}
					post_url="/post/{post?.id}"
					tags={post?.tags ? post?.tags.map((tag) => tag.content) : []}
					post_by_tags_url="/home"
					post_id={post?.id}
					my_user_id={id}
					{form}
				/>
				{#await data.streamed.comments}
					<Comments isLoading={true} />
				{:then commentsData}
					<Comments
						comments={commentsData.data}
						my_user_id={id}
						uniqueIdentifier={'desktop'}
						post_id={post?.id}
					/>
				{/await}
				<div
					class="fixed bottom-0 w-[344px] px-4 py-3 bg-lavandaGray dark:bg-purpleGray rounded-b-2xl mb-2"
				>
					<CommentPublicactionBar my_user_photo={profile_photo} post_id={post?.id} />
				</div>
			</aside>
		</div>
	{/if}
{/await}
