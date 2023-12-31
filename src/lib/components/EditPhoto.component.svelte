<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowLeft from './Icon/ArrowLeft.svelte';
	import Camera from '$lib/components/Icon/Camera.svelte';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	let uploadFile: HTMLInputElement;
	//STATIC ELEMENT
	export let widthA: number = 360;
	export let heightA: number = 360;

	//DINAMIC ELEMENT
	export let widthB: number = 0;
	export let heightB: number = 0;
	let aspectRatio: number;
	//INITIAL POSITION
	let x: number;
	let y: number;

	//STATE
	let grab = false;
	let a = 0;
	let mouseOCoords = { x: 0, y: 0 };
	let mouseNCoords = { x: 0, y: 0 };

	//INNER
	let fWidthA: string = widthA.toString() + 'px';
	let fHeightA: string = heightA.toString() + 'px';

	let fileUrl = '';
	let image: HTMLImageElement;
	let croppedUrl: string;
	let imageSized: HTMLImageElement | null;
	let container: HTMLDivElement;
	let containerCoords: DOMRect;
	let file: File | undefined;
	let fileCropped: File | undefined;
	let submitButton: HTMLButtonElement;

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);
	});

	function getCoords() {
		containerCoords = container.getBoundingClientRect();
		let divRed = document.querySelector('.divRed');
		let divPurple = document.querySelector('.divPurple');

		let coordsB = divRed?.getBoundingClientRect();
		let coordsA = divPurple?.getBoundingClientRect();
		if (coordsA && coordsB) {
			return {
				A: { x: coordsA.x - containerCoords.x, y: coordsA.y - containerCoords.y },
				B: { x: coordsB.x - containerCoords.x, y: coordsB.y - containerCoords.y }
			};
		} else {
			throw new Error('No elements found to get position');
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!container) return;
		containerCoords = container.getBoundingClientRect();
		let coords = getCoords();
		mouseNCoords = { x: event.clientX, y: event.clientY };

		if (grab) {
			if (a > 0) {
				if (coords.B && coords.A) {
					x = coords.B.x + (mouseNCoords.x - mouseOCoords.x);
					if (x > coords.A.x) x = coords.A.x;
					if (x + widthB < coords.A.x + widthA) x = coords.A.x + widthA - widthB;
					y = coords.B.y + (mouseNCoords.y - mouseOCoords.y);
					if (y > coords.A.y) y = coords.A.y;
					if (y + heightB < coords.A.y + heightA) y = coords.A.y + heightA - heightB;
				}
			}
			a++;
		}
		mouseOCoords = { x: event.clientX, y: event.clientY };
	}

	function handleWheel(event: WheelEvent) {
		let coords = getCoords();

		if (event.deltaY >= 0) {
			//Size Check
			widthB = widthB - 40;
			if (widthB < widthA) widthB = widthA;
			heightB = widthB / aspectRatio;
			if (heightB < heightA) heightB = heightA;
			if (Math.round((widthB / heightB) * 100) / 100 != aspectRatio) {
				heightB = heightA;
				widthB = heightB * aspectRatio;
			}

			//Position check
			if (x > coords.A.x) x = coords.A.x;
			if (x + widthB < coords.A.x + widthA) x = coords.A.x + widthA - widthB;
			if (y > coords.A.y) y = coords.A.y;
			if (y + heightB < coords.A.y + heightA) y = coords.A.y + heightA - heightB;
		}
		if (event.deltaY < 0) {
			widthB = widthB + 40;
			heightB = widthB / aspectRatio;
		}
	}

	function chargeFile(event: any) {
		containerCoords = container.getBoundingClientRect();
		file = event.target.files?.[0];
		if (!file) return;
		fileUrl = URL.createObjectURL(file);
		let reader = new FileReader();
		reader.onload = function (event) {
			let dataURL = event.target?.result;
			image = new Image();
			image.onload = function () {
				widthB = image.width;
				heightB = image.height;
				aspectRatio = Math.round((widthB / heightB) * 100) / 100;

				//INITIAL SIZE
				if (widthB != widthA) widthB = widthA;
				heightB = widthB / aspectRatio;
				if (heightB < heightA) heightB = heightA;
				if (Math.round((widthB / heightB) * 100) / 100 != aspectRatio) {
					heightB = heightA;
					widthB = heightB * aspectRatio;
				}

				//INITIAL POSISION
				let coords = getCoords();
				let positionCenter = { x: coords.A.x + widthA / 2, y: coords.A.y + heightA / 2 };
				x = positionCenter.x - widthB / 2;
				y = positionCenter.y - heightB / 2;
			};
			if (typeof dataURL == 'string') {
				image.src = dataURL;
				let element = document.getElementById('edit_dialog_profile_photo') as HTMLDialogElement;
				element.showModal();
			}
		};
		reader.readAsDataURL(file);
	}

	function crop() {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let divRed = document.querySelector('.divRed');

		imageSized = document.querySelector('.imageSized');
		if (!image || !imageSized || !file) return;
		canvas.width = imageSized.width;
		canvas.height = imageSized.height;

		context?.drawImage(imageSized, 0, 0, imageSized.width, imageSized.height);

		if (divRed) {
			let coords = getCoords();

			let startX = coords.A.x - coords.B.x; // Posición inicial de corte en X
			let startY = coords.A.y - coords.B.y; // Posición inicial de corte en Y
			let croppedImage = context?.getImageData(startX, startY, widthA, heightA);

			if (croppedImage) {
				let canvas2 = document.createElement('canvas');
				let context2 = canvas2.getContext('2d');
				canvas2.width = croppedImage.width;
				canvas2.height = croppedImage.height;
				context2?.putImageData(croppedImage, 0, 0);
				canvas2.toBlob((blob) => {
					if (!blob) return;
					fileCropped = new File([blob], 'hola', { type: 'image/png' });
				}, 'image/png');
				croppedUrl = canvas2.toDataURL();
				canvas2.remove();
			}
		}
		canvas.remove();
	}

	function handleClose() {
		let element = document.getElementById('edit_dialog_profile_photo') as HTMLDialogElement;
		element.close();
	}

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				await applyAction(result);
				handleClose();
			} else if (result.type === 'redirect') {
				await applyAction(result);
				handleClose();
			}
		};
	};
</script>

<button
	type="button"
	class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full flex items-center justify-center p-2 absolute cursor-pointer"
	on:click={() => {
		uploadFile.click();
	}}
>
	<div class="w-[24px] h-[24px]"><Camera /></div>
	<!-- IMAGE INPUT -->
	<input
		tabindex="-1"
		type="file"
		name="thumbnail"
		accept="image/*"
		class="w-0 h-0 t absolute"
		on:change={chargeFile}
		bind:this={uploadFile}
	/>
</button>

<dialog
	id="edit_dialog_profile_photo"
	class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] w-[600px] max-h-[600px] h-[90vh] py-3"
>
	{fileCropped}
	<div class="grid grid-rows-[10%,1fr] h-full">
		<form
			method="POST"
			enctype="multipart/form-data"
			action="/profile?/editProfilePhoto"
			use:enhance={submit}
		>
			<div class="grid grid-cols-[20%,1fr,20%] w-full h-fit mb-2 relative">
				<button
					on:click={handleClose}
					class="col-span-1 w-fit hover:bg-purpleLight active:translate-y-[-1px] rounded-full p-1"
					><ArrowLeft width={26} height={26} /></button
				>
				<p class="text-white font-bold text-xl col-span-1 w-fit justify-self-center">
					Edit profile photo
				</p>
				<button
					on:click={crop}
					type="button"
					class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full font-bold text-white px-2.5 py-1 col-span-1 w-fit justify-self-end"
					>Apply</button
				>
				<button type="submit" tabindex="-1" bind:this={submitButton}>SUBMIT</button>
				<input
					type="hidden"
					bind:value={fileCropped}
					name="file_cropped"
					on:change={() => {
            console.log("TRUE")
						submitButton.click();
					}}
				/>
			</div>
		</form>

		<div bind:this={container} class="w-full h-full">
			<div
				class="bg-gray-800 w-full h-full overflow-hidden relative flex"
				on:mousedown={() => {
					grab = true;
				}}
				on:mouseup={() => {
					grab = false;
				}}
				on:mouseleave={() => {
					grab = false;
				}}
				on:wheel={handleWheel}
			>
				<div
					class="divPurple self-center mx-auto z-30 shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] border-krispyPurple border-[5px]"
					style="width: {fWidthA}; height: {fHeightA};"
				/>
				<div
					class="divRed text-white z-20 pointer-events-none absolute"
					style="transform: translate({x}px, {y}px); width: {widthB}px; height: {heightB}px;"
				>
					<img class="imageSized w-full object-cover" src={image ? image.src : ''} alt="" />
				</div>
			</div>
		</div>
	</div>
</dialog>
