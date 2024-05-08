<script lang="ts">
	import type { ActionData } from './$types';
	import { Login } from '$components';
	export let form: ActionData;
</script>

<div class="col-span-12 md:col-span-6 bg-krispyPurple flex">
	<Login {form} />
</div>
  
<div class="max-md:hidden col-span-6 bg-black flex">
	<div class="bg-krispyPurple m-auto border-solid border-2 rounded-3xl border-krispyPurple">
		<div class="flex flex-col gap-y-5 items-start px-8 py-9">
			<h1 class="text-4xl font-bold">Are you new in <br /> Scribbles?</h1>
			<p class="font-bold">
				Join to the newest platform where <br /> you can share all your moments
			</p>
			<a href="/signup">
				<button class="bg-black text-krispyPurple rounded-xl w-36 h-12">
					<span class="px-auto font-bold">Sign Up</span>
				</button></a
			>
		</div>
	</div>
</div>
