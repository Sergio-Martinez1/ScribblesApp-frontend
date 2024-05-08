<script lang="ts">
  import type { ActionData } from './$types';
  import {Signup} from "$components";
  export let form: ActionData;
</script>

<div class="col-span-full  bg-black flex">
  <Signup {form} />
</div>
