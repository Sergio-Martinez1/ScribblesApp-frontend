<script lang="ts">
	import { NavBar } from '$components';
	import { Post } from '$components';
	import { Tops } from '$components';
	import { Footer } from '$components';
	import { PublicationBar } from '$components';
	import { LoginInHome } from '$components';

	const post_data = {
		user_photo_url:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJr94g26anSnYVgCnaDlZvKLRA51Fk6HLIsw&usqp=CAU',
		user_name: 'mutska',
		user_url: '#',
		post_url: '#',
		posted_ago: '1d',
		post_content: 'Este es un ejemplo del texto de un post',
		post_thumbnail_url:
			'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',
		like_on: true,
		likes_count: 65,
		comments_count: 10,
		tags_count: 3
	};
	let num_posts = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	const top_tags = {
		top_one: 'Music',
		top_two: 'ChatGpt',
		top_three: 'Weather'
	};
	let isLogin: boolean = false;
</script>

<div class="col-span-2">
	<div class="mt-8">
		<NavBar />
	</div>
</div>
<div class="col-span-7">
	<div class="flex flex-col gap-y-4 mt-8">
		{#if isLogin}
			<PublicationBar />
		{:else}
			<LoginInHome />
		{/if}
		{#each num_posts as post}
			<Post {...post_data} />
		{/each}
	</div>
</div>
<div class="col-span-3">
  <div class="h-72">
	<div class="flex flex-col gap-y-2 items-start mt-32 sticky">
		<div class="bg-purpleGray rounded-2xl px-4 py-5 min-w-full">
			<h1 class="text-white font-bold">Welcome</h1>
			<p class="text-white">This is your home page. Checkout the new updates.</p>
		</div>
		<Tops {...top_tags} />
		<Footer />
	</div>
  </div>
</div>
