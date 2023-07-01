<script lang="ts">
  export let tags:string[];
  export let posts_url:string = '/posts';
</script>

<div class="tags-component bg-krispyPurple px-5 py-3 w-48 rounded-2xl">
  <p class="font-bold text-white mb-2">Tags</p>
  <div class="flex flex-wrap mb-1">
    {#if tags}
      {#each tags as tag}
        <a href="{posts_url}/{tag}" class="font-bold text-white mr-2.5 hover:underline">{tag}</a>
      {/each}
    {:else}
      <p class="font-bold text-white mx-auto">No tags</p>
    {/if}
  </div>
</div>
