<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>
		<form
			class="px-8 py-9 flex flex-col items-start gap-y-4"
			action="?/account"
			method="POST"
			use:enhance
		>
			<h1 class="text-white text-4xl font-bold">Delete Account</h1>

			<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
				<span class="px-auto font-bold text-white">Delete</span>
			</button>
		</form>
