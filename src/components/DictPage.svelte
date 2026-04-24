<script lang="ts">
  import type { CollectionEntry } from "astro:content";

  interface Props {
    post: CollectionEntry<"dictionary">;
  }

  const { post }: Props = $props();
</script>

{#if post.data.definitions}
  <ol class={post.data.definitions.length == 1 ? "only" : ""}>
    {#each post.data.definitions as definition, i (i)}
      <li class={definition.enumeration.match(/[a-z]/) ? "sub" : ""}>
        {#if post.data.definitions.length > 1}
          <span class="marker">{definition.enumeration || i + 1}. </span>
        {/if}
        <!-- {#if definition.pos}
          <span class="pos">{definition.pos}</span>
        {/if} -->
        {@html definition.eng} —
        <b>{@html definition.tok}</b>

        {#if definition.examples}
          <ul>
            {#each definition.examples as example}
              <li>
                <i>{@html example.tok}</i>
                <br />
                {@html example.eng}
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ol>
{/if}

{#if post.data.notes}
  {@html post.data.notes}
{/if}

<!-- Implementation of a design by mute ante, more or less -->
<!-- <style>
  .keyword {
    color: #1d6bca;
    font-weight: 800;
    padding-inline-end: 5px;
  }
  p {
    padding-bottom: 15px;
  }
  .examples {
    font-weight: normal !important;
    font-style: normal !important;
  }
</style>
<p>
  {
    !post.data.definitions ? (
      <p class="keyword">{post.data.title}</p>
    ) : (
      post.data.definitions.map((definition, index) => (
        <>
          <span>
            {!index && <span class="keyword">{post.data.title}</span>}
            {post.data.definitions!.length > 1 && (
              <span class="keyword">{index + 1}</span>
            )}
            <span>
              <b>
                {post.data.definitions!.length > 1 && definition.eng}
                {" — "}
                {definition.tok}.
              </b>
            </span>
            {definition.examples && (
              <span class="examples">
                {"["}
                {definition.examples.map((example) => (
                  <>
                    <i set:html={md(example.tok)} />
                    <span> </span>
                    <span set:html={md(example.eng)} />
                  </>
                ))}
                {"]"}
              </span>
            )}
          </span>
          <br />
        </>
      ))
    )
  }
</p> -->

<style>
  ol {
    padding-left: 30px;
  }
  ul {
    padding-left: 10px;
    padding-inline: 15px 0px;
    border-inline-start: 3px solid var(--grey-1);
    margin-left: 1px;

    list-style-type: none;
  }
  ol > li {
    margin-bottom: 20px;
  }
  ul > li {
    margin-bottom: 10px;
    /*margin-left: 15px;
    border-left: 1px solid var(--grey);*/
    /*margin: 5px 0px;*/
    /*color: var(--grey);*/
  }
  li {
    list-style-type: none;
    position: relative;
  }
  .marker {
    position: absolute;
    left: -45px;
    width: 40px;
    text-align: right;
    user-select: none;
  }
  /*.only {
    padding-left: 0;
  }*/
  .sub {
    margin-left: 50px;
  }
  /*.pos {
    font-weight: bold;
    font-style: italic;*/
  /*padding: 0px 5px;*/
  /*margin: 0px 5px;*/
  /*font-variant: small-caps;*/
  /*border: 1px solid var(--grey-1);*/
  /*border-radius: 5px;*/
  /*}*/
</style>
