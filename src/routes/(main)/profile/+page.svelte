<script lang="ts">
	import { NavBar } from '$components';
	import { CoverPhoto } from '$components';
	import { ProfilePhoto } from '$components';
	import { UserDescription } from '$components';
	import { Post } from '$components';

	let isLogin: boolean = false;
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
</script>

<div class="col-span-2">
	<div class="mt-8">
		<NavBar />
	</div>
</div>
<div class="col-span-10">
	<div class="flex flex-col gap-y-4 mt-8">
    <CoverPhoto />
		<div class="flex flex-row gap-x-8">
      <ProfilePhoto />
			<UserDescription />
		</div>
	</div>
	<div class="flex flex-col gap-y-8">
		{#each num_posts as post}
			<Post {...post_data} />
		{/each}
	</div>
</div>
