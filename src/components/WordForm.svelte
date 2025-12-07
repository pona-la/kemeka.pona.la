<script lang="ts">
  import { test_words } from "@/lib/words";

  const choose_random = (arr: any[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  let current_word = choose_random(test_words);
  let input_value = "";
  let submitted_value: string[] = [];
  $: (submitted_value,
  () => {
    current_word = choose_random(test_words);
    input_value = "";
  })();

  const submit = () => {
    submitted_value = [...submitted_value, input_value];
  };
</script>

<form on:submit|preventDefault={submit}>
  <center>
    <p>Please translate: <b>{current_word}</b></p>
    <input bind:value={input_value} />

    {#if submitted_value.length > 0}
      <p><b>Submitted:</b> {submitted_value.join(", ")}</p>
    {/if}
  </center>
</form>

<style>
  input {
    text-align: center;
    width: 50%;
    padding: 10px;
  }
</style>
