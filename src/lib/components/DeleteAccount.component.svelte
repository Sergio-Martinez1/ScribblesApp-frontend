<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from './Button.component.svelte';

	let isLoading: boolean = false;
	let error: boolean = false;
	let submitButton: any;

	function handleSubmit() {
		const confirmationDialog = document.getElementById('confirmationDialog') as HTMLDialogElement;
		confirmationDialog.showModal();
	}
	function confirmSubmission() {
		const deleteForm = document.getElementById('deleteForm') as HTMLFormElement;
		deleteForm.submit();
	}

	function cancelSubmission() {
		const confirmationDialog = document.getElementById('confirmationDialog') as HTMLDialogElement;
		confirmationDialog.close();
		submitButton.resetButtonState();
	}

	const submit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				invalidateAll();
				confirmSubmission();
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				isLoading = false;
				error = true;
			}
			isLoading = false;
		};
	};
</script>

<form class="flex flex-col items-start gap-y-4">
	<h1 class="dark:text-white text-4xl font-bold">Delete Account</h1>

	<button
		class="bg-krispyPurple dark:text-white rounded-xl w-32 h-10 self-center justify-self-center"
		type="button"
		on:click={handleSubmit}
	>
		<span class="px-auto font-bold text-white">Delete</span>
	</button>
</form>

<dialog
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
	id="confirmationDialog"
>
	<form class="p-4 overflow-hidden" action="?/deleteAccount" method="POST" use:enhance={submit} id="deleteForm">
		<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Delete account permanently?</p>
		<p class="dark:text-white mb-3">This action will delete your account permanently.</p>
		<div class="flex items-center justify-center mb-1">
			<div class="flex gap-3">
				<button
					on:click={cancelSubmission}
					type="button"
					value="cancel"
					formmethod="dialog"
					class="bg-squeezeRed hover:grayscale-[15%] text-white p-2.5 rounded-2xl w-28 h-10 flex items-center justify-center"
				>
					Cancel
				</button>

				<div class="self-center justify-self-center">
					<Button
						disabled={isLoading}
						{isLoading}
						bind:error
						text={'Confirm'}
						bind:this={submitButton}
					/>
				</div>
			</div>
		</div>
	</form>
</dialog>
