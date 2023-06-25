<script lang="ts">
  export let top_one: string = ""; 
  export let top_two: string = ""; 
  export let top_three: string = ""; 
</script>


<div class="py-4 px-9 flex flex-col items-center gap-y-2 bg-purpleGray rounded-2xl m-auto max-h-fit">
	<h1 class="text-white text-xl font-bold">On time for</h1>
    <div class="flex flex-col items-center gap-y-1">
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight">
    <h1 class="text-white">{top_one}</h1>
    </div>
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight">
    <h1 class="text-white">{top_two}</h1>
    </div>
    <div class="flex flex-col items-start gap-y-0 bg-purpleLight">
    <h1 class="text-white">{top_three}</h1>
    </div>
  </div>
</div>
