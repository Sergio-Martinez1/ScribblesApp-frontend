<script lang="ts">
  export let top_one: string = ""; 
  export let top_two: string = ""; 
  export let top_three: string = ""; 
</script>


<div class="py-4 px-9 flex flex-col items-start gap-y-2 bg-purpleGray rounded-2xl m-auto max-h-fit min-w-full">
	<h1 class="text-white text-xl font-bold">On time for</h1>
    <div class="flex flex-col items-start gap-y-2 min-w-full">
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight rounded-2xl min-w-full py-3 pl-3">
    <h1 class="text-white font-bold text-xl">#{top_one}</h1>
      <p class="text-white">1,2K Posts</p>
    </div>
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight rounded-2xl min-w-full py-3 pl-3">
    <h1 class="text-white font-bold text-xl">#{top_two}</h1>
      <p class="text-white">1,2K Posts</p>
    </div>
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight rounded-2xl min-w-full py-3 pl-3">
    <h1 class="text-white font-bold text-xl">#{top_three}</h1>
      <p class="text-white">1,2K Posts</p>
    </div>
  </div>
</div>
