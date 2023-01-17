<script lang="ts">  
    // export let format = 'YYYY-MM-DD'
    
    export let date = new Date()
    let internal:string
  
    function formatDate(x:Date) {
      return new Date(x.getTime() - (x.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
    }
    const input = (x:Date) => {
      try {
        internal = formatDate(x)
      } catch {}
    }
    const output = (x:string) => (date = new Date(x))
  
    $: input(date)
    $: output(internal)
</script>

<input type="date" bind:value={internal} />
  