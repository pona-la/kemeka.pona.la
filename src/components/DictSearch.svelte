<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  import { onMount } from "svelte";
  import Fuse from "fuse.js";

  import DictPage from "./DictPage.svelte";

  interface Props {
    posts: CollectionEntry<"content">[];
  }

  const { posts }: Props = $props();

  let search = $state("");

  onMount(() => {
    let params = new URLSearchParams(window.location.search);
    search = params.get("q")?.replaceAll("_", " ") ?? "";
  });

  $effect(() => {
    if (search) {
      window.history.replaceState(
        search,
        "",
        "/?q=" + search.replaceAll(" ", "_"),
      );
    } else {
      window.history.replaceState(search, "", "/");
    }
  });

  const fuse = $derived(
    new Fuse(posts, {
      keys: [
        { name: "data.title", weight: 1 },
        { name: "data.definitions.tok", weight: 0.4 },
        { name: "data.definitions.eng", weight: 0.4 },
        { name: "data.definitions.examples.tok", weight: 0.15 },
        { name: "data.definitions.examples.eng", weight: 0.15 },
        { name: "data.notes", weight: 0.15 },
      ],
      ignoreLocation: true,
      threshold: 0.15,
    }),
  );
  const filteredPosts = $derived(
    !search.trim() ? posts : fuse.search(search).map((result) => result.item),
  );
</script>

<input type="search" id="search" bind:value={search} />

<center>
  Showing <b
    >{filteredPosts.length === posts.length
      ? `${posts.length}`
      : `${filteredPosts.length}/${posts.length}`}</b
  > words
</center>

{#each filteredPosts as post (post.id)}
  <section>
    <h2>{post.data.title}</h2>
    <DictPage {post} />
  </section>
{/each}
