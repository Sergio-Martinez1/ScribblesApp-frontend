<script lang="ts">
	import { enhance } from '$app/forms';
	import { redirect } from '@sveltejs/kit';

	let goBack = () => {
		redirect(303, '/home');
	};
</script>

<div class="bg-krispyPurple m-auto border-solid border-2 rounded-3xl border-krispyPurple">
	<form
		class="px-8 py-9 flex flex-col items-start gap-y-2"
		action="?/logout"
		method="POST"
		use:enhance
	>
		<h1 class="text-black text-4xl font-bold">Are you sure to logout?</h1>
		<div class="flex flex-row items-center min-w-full justify-between">
			<button class="bg-black text-black rounded-xl w-32 h-10" type="submit">
				<span class="px-auto font-bold text-krispyPurple">Logout</span>
			</button>
			<a href="/home">
				<button class="bg-black text-black rounded-xl w-32 h-10" type="button">
					<span class="px-auto font-bold text-krispyPurple">Cancel</span>
				</button>
			</a>
		</div>
	</form>
</div>
