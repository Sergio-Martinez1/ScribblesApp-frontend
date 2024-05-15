<script lang="ts">
	import settings from '../../stores/settings';

	export let dark_mode: string | null;

	let errorOnUpdateColorScheme: boolean = false;

	const updateColorScheme = (dark_mode: string, color_scheme: string) => {
		let formData = new FormData();
		formData.append('dark_mode', dark_mode);
		formData.append('color_scheme', color_scheme);
		$settings.dark_mode = dark_mode;
		$settings.color_scheme = color_scheme;
		fetch('http://localhost:5173/api/updateUser', {
			method: 'put',
			body: formData
		}).catch((error) => {
			errorOnUpdateColorScheme = true;
		});
	};
</script>

<section class="flex flex-col gap-y-4 dark:text-white">
	<h1 class="text-4xl font-bold">Dark mode</h1>
	<p>Adjust the aspect of Scribbles to decrease de brightness of the screen and rest the view.</p>
	<div
		class="w-[170px] md:w-[250px] flex flex-col gap-y-1 text-lg self-center border border-black rounded-2xl p-2"
	>
		<label for="disabled" class="flex justify-between">
			Disabled
			<input
				id="disabled"
				name="dark_mode"
				type="radio"
				checked = {dark_mode === 'disabled'}
				on:input={() => {
					updateColorScheme('disabled', 'light');
				}}
			/>
		</label>
		<label for="enabled" class="flex justify-between">
			Enabled
			<input
				id="enabled"
				name="dark_mode"
				type="radio"
				checked = {dark_mode === 'enabled'}
				on:input={() => {
					updateColorScheme('enabled', 'dark');
				}}
			/>
		</label>
		<label for="automatic" class="flex justify-between">
			Automatic
			<input
				id="automatic"
				name="dark_mode"
				type="radio"
				checked = {dark_mode === 'automatic'}
				on:input={() => {
					if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
						updateColorScheme('automatic', 'dark');
					} else {
						updateColorScheme('automatic', 'light');
					}
				}}
			/>
		</label>
	</div>
</section>

<style lang="postcss">
	section div label input {
		appearance: none;
		width: 1.2rem;
		height: 1.2rem;
		@apply border-2 border-black dark:border-white rounded-xl;
		position: relative;
		transition: all 0.1s ease-in;
	}

	section div label {
		@apply hover:bg-hoverLavanda dark:hover:bg-hoverPurple rounded-2xl px-3 py-4;
	}

	section div label input:checked {
		@apply border-krispyPurple;
	}

	section div label input:after {
		content: '';
		width: 0;
		height: 0;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all 0.1s ease-in;
	}

	section div label input:checked:after {
		width: 0.7rem;
		height: 0.7rem;
		@apply bg-krispyPurple;
	}
</style>
