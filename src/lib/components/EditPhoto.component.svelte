<script lang="ts">
	import ArrowLeft from './Icon/ArrowLeft.svelte';
	import Camera from '$lib/components/Icon/Camera.svelte';
	import { invalidateAll } from '$app/navigation';

	export let imagename: string = '';
	export let dialogId: string = '';
	export let cover_mode: boolean = false;

	let uploadFile: HTMLInputElement;

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

	let fileUrl = '';
	let image: HTMLImageElement;
	let croppedUrl: string;
	let imageSized: HTMLImageElement | null;
	let container: HTMLDivElement;
	let containerCoords: DOMRect;
	let file: File | undefined;
	let fileCropped: File;
	let divRed: HTMLDivElement;
	let divPurple: HTMLDivElement;

	let widthA: number;
	let heightA: number;
	const CoverWidth = 900;
	const CoverHeight = 300;
	const ProfileWidth = 340;
	const ProfileHeight = 340;
	let imageSizedWidth = widthB;
	let imageSizedHeight = heightB;

	function getCoords() {
		containerCoords = container.getBoundingClientRect();

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
		let element = document.getElementById(`${dialogId}`) as HTMLDialogElement;
		element.showModal();
		document.body.style.overflow = 'hidden';
		document.addEventListener('mousemove', handleMouseMove);
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

				widthA = divPurple.offsetWidth;
				heightA = divPurple.offsetHeight;

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
			}
		};
		reader.readAsDataURL(file);
	}

	async function crop() {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');

		if (!image || !imageSized) return;

		let coords = getCoords();
		let widthRatio = divRed.offsetWidth / divPurple.offsetWidth;
		let heightRatio = divRed.offsetHeight / divPurple.offsetHeight;
		let newWidth = (cover_mode ? CoverWidth : ProfileWidth) * widthRatio;
		let newHeight = (cover_mode ? CoverHeight : ProfileHeight) * heightRatio;
		let startX = ((coords.A.x - coords.B.x) / divRed.offsetWidth) * newWidth; // Posición inicial de corte en X
		let startY = ((coords.A.y - coords.B.y) / divRed.offsetHeight) * newHeight; // Posición inicial de corte en Y

		canvas.width = image.width;
		canvas.height = image.height;
		context?.drawImage(image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight);

		let croppedImage = context?.getImageData(
			startX,
			startY,
			cover_mode ? CoverWidth : ProfileWidth,
			cover_mode ? CoverHeight : ProfileHeight
		);

		if (croppedImage) {
			let canvas2 = document.createElement('canvas');
			let context2 = canvas2.getContext('2d');
			canvas2.width = croppedImage.width;
			canvas2.height = croppedImage.height;
			context2?.putImageData(croppedImage, 0, 0);
			canvas2.toBlob((blob) => {
				if (!blob) return;
				fileCropped = new File([blob], 'Imagen', { type: 'image/png' });
			}, 'image/png');
			croppedUrl = canvas2.toDataURL();
			canvas2.remove();
			document.removeEventListener('mousemove', handleMouseMove);
		}
		canvas.remove();
	}

	function handleClose() {
		let element = document.getElementById(`${dialogId}`) as HTMLDialogElement;
		element.close();
		document.body.style.overflow = 'auto';
		croppedUrl = '';
		if (imageSized) imageSized.src = '';
		document.removeEventListener('mousemove', handleMouseMove);
		console.log(imageSized);
	}

	const submit = async () => {
		let formData = new FormData();
		formData.append(`${imagename}`, fileCropped);

		fetch('http://localhost:5173/api/upload', {
			method: 'post',
			body: formData
		})
			.then(async (response) => {
				if (response.status == 200) {
					await invalidateAll();
				}
			})
			.catch((error) => {});

		handleClose();
	};
</script>

<button
	type="button"
	class="flex items-center justify-center cursor-pointer"
	on:click={() => {
		uploadFile.click();
	}}
>
	<slot />


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
	id={dialogId}
	class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] w-[600px] max-h-[600px] h-[90vh] py-3"
>
	<div id="edit_photo_form" class="grid grid-rows-[10%,90%] h-full">
		<div class="grid grid-cols-[20%,1fr,20%] w-full h-fit mb-2 relative">
			<button
				type="button"
				on:click={handleClose}
				class="col-span-1 w-fit hover:bg-purpleLight active:translate-y-[-1px] rounded-full p-1"
				><ArrowLeft width={26} height={26} /></button
			>
			<p class="text-white font-bold text-xl col-span-1 w-fit justify-self-center">
				Edit profile photo
			</p>
			{#if !croppedUrl}
				<button
					on:click={crop}
					type="button"
					class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full font-bold text-white px-2.5 py-1 col-span-1 w-fit justify-self-end"
					>Apply</button
				>
			{/if}
		</div>

		<div bind:this={container} class="w-full h-full">
			{#if croppedUrl}
				<div class="w-full h-full">
					<div class="w-full h-[85%] flex justify-center items-center bg-purpleLight">
						{#if !cover_mode}
							<div class="aspect-square rounded-full h-[60%] sm:h-[80%]">
								<img
									class="w-full h-full object-cover rounded-full border-krispyPurple border-[5px]"
									src={croppedUrl}
									alt=""
								/>
							</div>
						{:else}
							<div class="w-[75%] aspect-[3/1] rounded-2xl">
								<img
									class="w-full h-full object-cover rounded-2xl border-krispyPurple border-[5px]"
									src={croppedUrl}
									alt=""
								/>
							</div>
						{/if}
					</div>
					<div class="w-full h-[15%] flex items-center justify-center gap-x-14">
						<button
							on:click={handleClose}
							class="bg-squeezeRed hover:bg-red-600 active:bg-squeezeRed rounded-full font-bold text-md text-white px-4 py-2 w-24"
							type="button">Cancel</button
						>
						<button
							on:click={submit}
							class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full font-bold text-md text-white px-4 py-2 w-24"
							>Confirm</button
						>
					</div>
				</div>
			{:else}
				<div
					class="bg-gray-800 w-full h-full overflow-hidden relative flex {grab
						? 'cursor-grabbing'
						: 'cursor-grab'}"
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
					{#if !cover_mode}
						<div
							bind:this={divPurple}
							class="divPurple self-center mx-auto z-30 shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] border-krispyPurple border-[5px] rounded-full aspect-square h-[60%] sm:h-[80%]"
						/>
						<div
							bind:this={divRed}
							class="divRed text-white z-20 pointer-events-none absolute"
							style="transform: translate({x}px, {y}px); width: {widthB}px; height: {heightB}px;"
						>
							<img
								bind:this={imageSized}
								class="imageSized w-full object-cover"
								src={image ? image.src : ''}
								alt=""
							/>
						</div>
					{:else}
						<div
							bind:this={divPurple}
							class="divPurple self-center mx-auto z-30 shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] border-krispyPurple border-[5px] rounded-2xl aspect-[3/1] w-[80%]"
						/>
						<div
							bind:this={divRed}
							class="divRed text-white z-20 pointer-events-none absolute"
							style="transform: translate({x}px, {y}px); width: {widthB}px; height: {heightB}px;"
						>
							<img
								bind:this={imageSized}
								width={imageSizedWidth}
								height={imageSizedHeight}
								class="imageSized w-full object-cover"
								src={image ? image.src : ''}
								alt=""
							/>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</dialog>
