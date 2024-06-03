<script lang="ts">
	import { fly } from 'svelte/transition';

	export let text: string = 'Post';
	export let isLoading: boolean = false;
	export let error: boolean = false;
	export let disabled: boolean = false;
	export let errorMessage: boolean = false;
	export let reset: boolean = false;
	export let buttonType: number = 0;
	let animations: boolean = false;
	let timeOutErrorMessageId: number;

	export function resetButtonState() {
		isLoading = false;
		error = false;
		disabled = false;
		errorMessage = false;
		reset = false;
		animations = false;
		if (timeOutErrorMessageId) {
			clearTimeout(timeOutErrorMessageId);
		}
	}

	$: {
		if (error == true) {
			clearTimeout(timeOutErrorMessageId);
			animations = true;
			disabled = true;
			errorMessage = true;
			setTimeout(() => {
				error = false;
			}, 900);
			setTimeout(() => {
				disabled = false;
				animations = false;
			}, 1000);
			timeOutErrorMessageId = setTimeout(() => {
				errorMessage = false;
			}, 5000);
		}
	}
</script>

{#if buttonType === 0}
	<div class="relative w-28 h-10 flex justify-center items-center">
		<button
			value="default"
			type="submit"
			on:click
			disabled={error || disabled || isLoading}
			class="{error ? 'bg-squeezeRed' : 'bg-krispyPurple'} {disabled || isLoading
				? ''
				: 'active:bg-krispyPurple'}  hover:bg-lessPurple h-10 p-2.5 rounded-2xl flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 {error
				? 'hover:bg-squeezeRed active:bg-squeezeRed w-16 h-8'
				: 'w-28'} {animations ? 'transition-all duration-400' : ''}"
		>
			<span class="px-auto font-bold flex items-center justify-center">
				<div class="w-fit ml-5 {isLoading ? '' : 'hidden'}">
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				</div>
				<div class="container {error ? '' : 'hidden'}">
					<div class="circle">
						<div class="error"></div>
					</div>
				</div>
				<span class="{!error && !isLoading ? '' : 'hidden'} text-white">
					{text}
				</span>
			</span>
		</button>
		{#if errorMessage}
			<span
				in:fly={{ y: 10, duration: 300 }}
				out:fly={{ y: 10, duration: 300 }}
				class="text-squeezeRed absolute text-sm w-28 flex justify-center font-bold top-[100%] z-20"
				>Please reload</span
			>
		{/if}
	</div>
{:else}
	<div class="relative w-[130px] h-10 flex justify-center items-center">
		<button
			value="default"
			type="submit"
			on:click
			disabled={error || disabled || isLoading}
			class="{error ? 'bg-squeezeRed' : 'bg-black'} {disabled || isLoading
				? ''
				: 'active:border-none'}  hover:border-2 hover:border-white h-10 p-2.5 rounded-2xl flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 {error
				? 'hover:bg-squeezeRed active:bg-squeezeRed w-16 h-8'
				: 'w-[130px]'} {animations ? 'transition-all duration-400' : ''}"
		>
			<span class="px-auto font-bold flex items-center justify-center">
				<div class="w-fit ml-5 {isLoading ? '' : 'hidden'}">
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				</div>
				<div class="container {error ? '' : 'hidden'}">
					<div class="circle">
						<div class="error"></div>
					</div>
				</div>
				<span class="{!error && !isLoading ? '' : 'hidden'} text-krispyPurple">
					{text}
				</span>
			</span>
		</button>
		{#if errorMessage}
			<span
				in:fly={{ y: 10, duration: 300 }}
				out:fly={{ y: 10, duration: 300 }}
				class="text-squeezeRed absolute text-sm w-28 flex justify-center font-bold top-[100%] z-20"
				>Please reload</span
			>
		{/if}
	</div>
{/if}

<style>
	.circle {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}

	.circle {
		z-index: 1;
		position: relative;
		background: transparent;
		transform: scale(1);
		animation: success-anim 500ms ease;
	}

	@keyframes success-anim {
		0% {
			transform: scale(0);
		}
		30% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes circle-anim {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1.1);
		}
	}
	.error::before,
	.error::after {
		content: '';
		display: block;
		height: 2px;
		background: white;
		position: absolute;
	}

	.error::before {
		width: 18px;
		top: 48%;
		left: 14%;
		transform: rotateZ(50deg);
	}

	.error::after {
		width: 18px;
		top: 48%;
		left: 14%;
		transform: rotateZ(-50deg);
	}
</style>
