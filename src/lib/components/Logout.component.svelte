<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { redirect, type SubmitFunction } from '@sveltejs/kit';
	import session from '../../stores/session';

  let isLoading: boolean = false;
	let goBack = () => {
		redirect(303, '/home');
	};

	const submit: SubmitFunction = () => {
		isLoading = true;
		return ({ result }) => {
			if (result.type === 'redirect') {
				$session.home.posts = [];
				$session.home.limit = 5;
				$session.home.offset = 0;
				$session.home.scrollY = 0;
				isLoading = false;
			}
			applyAction(result);
		};
	};
</script>

<div class="bg-krispyPurple m-auto border-solid border-2 rounded-3xl border-krispyPurple">
	<form
		class="px-8 py-9 flex flex-col items-start gap-y-2"
		action="?/logout"
		method="POST"
		use:enhance={submit}
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
