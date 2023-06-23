<script lang="ts">
  export let width: number = 24, height: number = 24, stroke:string = "white";
</script>

<svg {width} {height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18" {stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 6L18 18" {stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
