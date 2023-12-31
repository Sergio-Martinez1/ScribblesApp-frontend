<script lang="ts">
	import { enhance } from '$app/forms';


	function handleSubmit(event: any) {
		event.preventDefault();
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
	}
</script>

<form
	class="px-8 py-9 flex flex-col items-start gap-y-4"
	action="?/deleteAccount"
	method="POST"
	use:enhance
  id="deleteForm"
>
	<h1 class="text-white text-4xl font-bold">Delete Account</h1>

	<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit" on:click|preventDefault={handleSubmit}>
		<span class="px-auto font-bold text-white">Delete</span>
	</button>
</form>

	<dialog class="bg-purpleGray rounded-2xl shadow-[0px_0px_10px_1px_black]" id="confirmationDialog">
		<form>
			<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete account permanently?</p>
			<p class="text-white mb-3">This action will delete your account permanently.</p>
			<div class="flex gap-3">
				<button
					value="cancel"
          on:click={confirmSubmission}
					formmethod="dialog"
					class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 rounded-2xl w-full"
				>
					Confirm
				</button>
				<button
					type="submit"
          on:click={cancelSubmission}
					value="default"
					class="bg-purpleLight hover:bg-squeezeRed text-white p-2.5 rounded-2xl w-full"
				>
					Cancel
				</button>
			</div>
		</form>
	</dialog>
