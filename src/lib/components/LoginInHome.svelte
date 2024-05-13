<script lang="ts">
	export let signup_url: string = '/signup';
	export let login_url: string = '/login';
	import ArrowRight from '$lib/components/Icon/ArrowRight.svelte';
</script>

<div class="grid grid-cols-2 h-fit gap-4">
	<div
		class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-2 p-4"
	>
		<p class="dark:text-white font-bold flex items-center justify-center text-center">
			Are you new here?
		</p>
		<div class="hidden sm:inline-block">
			<ArrowRight />
		</div>
		<a
			href={signup_url}
			class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-2xl w-[120px] h-[40px] text-white font-bold flex items-center justify-center"
			>SignUp</a
		>
	</div>
	<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-2 p-4">
		<p class="dark:text-white font-bold flex items-center justify-center text-center">
			Have an account?
		</p>
		<div class="hidden sm:inline-block">
			<ArrowRight />
		</div>
		<a
			href={login_url}
			class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-2xl w-[120px] h-[40px] text-white font-bold flex items-center justify-center"
			>Login</a
		>
	</div>
</div>
