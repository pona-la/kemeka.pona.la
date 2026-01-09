<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  import { marked } from "marked";

  interface Props {
    post: CollectionEntry<"content">;
  }

  const { post }: Props = $props();

  function md(text: string) {
    const link_replacer = (_: any, text: string) =>
      `[${text}](?q=${text.replaceAll(" ", "_")})`;
    const linked_text = text.replaceAll(/\[(.+?)\](?!\()/g, link_replacer);
    const html_string = marked.parseInline(linked_text, { async: false });
    return html_string;
  }
</script>

<style>
  ol {
    padding-left: 30px;
  }
  ul {
    padding-left: 20px;
    list-style-type: none;
  }
  ol > li {
    margin-bottom: 20px;
  }
  ul > li {
    margin-bottom: 10px;
  }
</style>

{#if post.data.definitions}
  <ol>
    {#each post.data.definitions as definition, i (i)}
      <li>
        {@html definition.eng} —
        <b>{@html definition.tok}</b>

        {#if definition.examples}
          <ul>
            {#each definition.examples as example}
              <li>
                <i>{@html md(example.tok)}</i>
                <br />
                <span>{@html md(example.eng)}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ol>
{/if}

{#if post.data.notes}
  <p>
    {@html post.data.notes}
  </p>
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
