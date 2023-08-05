<script lang="ts">
	import { onMount } from 'svelte';

	//STATIC ELEMENT
	export let widthA: number = 400;
	export let heightA: number = 400;

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

	let file: File;
	let fileUrl = '';
	let image: HTMLImageElement;
	let croppedUrl: string;
	let imageSized: HTMLImageElement;
	let container: HTMLDivElement;
	let containerCoords: DOMRect;

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
			console.log(`Container: ${containerCoords.x}, ${containerCoords.y}
StaticDiv: ${coords.A.x}, ${coords.A.y}
CoordsB: ${coords.B.x}, ${coords.B.y}
DinamicDiv: ${x}, ${y}`);
			a++;
		}
		mouseOCoords = { x: event.clientX, y: event.clientY };
	}

	function handleWheel(event: WheelEvent) {
		let coords = getCoords();

		console.log(event.deltaY);
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
		file = event.target.files[0];
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
			}
		};
		reader.readAsDataURL(file);
	}

	function crop() {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		imageSized = document.querySelector('.imageSized');
		canvas.width = imageSized.width;
		canvas.height = imageSized.height;

		context?.drawImage(imageSized, 0, 0, imageSized.width, imageSized.height);

		let divRed = document.querySelector('.divRed');

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
				croppedUrl = canvas2.toDataURL();
				canvas2.remove();
			}
		}
		canvas.remove();
	}
</script>

<div bind:this={container} class="w-full h-full">
	<div
		class="bg-black w-full h-full overflow-hidden relative flex"
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
			class="divPurple self-center mx-auto z-30 shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			style="width: {fWidthA}; height: {fHeightA};"
		/>
		<input class="absolute left-[50%] z-50" type="file" on:change={chargeFile} />
		<button on:click={crop} class="absolute left-[40%] z-50 bg-gray-50">Apply</button>
		<a class="absolute left-[30%] z-50 bg-gray-50" href={croppedUrl}>FILELINK</a>
		<div
			class="divRed text-white z-20 pointer-events-none absolute"
			style="transform: translate({x}px, {y}px); width: {widthB}px; height: {heightB}px;"
		>
			<img class="imageSized w-full object-cover" src={image ? image.src : ''} alt="" />
		</div>
	</div>
</div>
