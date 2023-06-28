<script lang="ts">
  import type { ActionData } from "./$types";
  import { enhance } from "$app/forms";
  export let form: ActionData;
</script>
<div class="bg-black m-auto border-solid border-2 rounded-3xl border-black">

  <form class="px-8 py-9 flex flex-col items-start gap-y-4" action="?/login" method="POST" use:enhance>
    <h1 class="text-krispyPurple text-4xl font-bold">Log in with your <br> account</h1>
    <div class="flex flex-col gap-y-4">
      <span class="text-krispyPurple font-bold">username</span>
      <input type="text" class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold" name="username" value={form?.username ?? ''}>
      {#if form?.usernameMissing}<p class="error text-red-500">Username required</p>{/if}
      <span class="text-krispyPurple font-bold">Password</span>
      <input type="password" class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold" name="password">
      {#if form?.passwordMissing}<p class="error text-red-500">Password Missing</p>{/if}
      {#if form?.passwordIncorrect}<p class="error text-red-500">Incorrect password</p>{/if}
    </div>
      <button class="bg-krispyPurple text-black rounded-xl w-32 h-10" type="submit">
      <span class="px-auto font-bold">Log in</span>
    </button>
      <div class="flex flex-row gap-x-2 items-start">
      <input type="checkbox" class="accent-krispyPurple rounded cursor-pointer w-6 h-6 " checked>
        <span class="text-krispyPurple font-bold">Remember me</span>
    </div>
      <a href="/recovery" class="text-krispyPurple underline">Forgot your password?</a>
  </form>
  
</div>

<style lang="postcss">
  input[type="checkbox"]:not(:checked) {
    background-color: red;
  }
</style>
