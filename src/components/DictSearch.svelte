<script lang="ts">
  import type { CollectionEntry } from "astro:content";
  import { onMount } from "svelte";
  import Fuse from "fuse.js";

  import DictPage from "./DictPage.svelte";

  interface Props {
    posts: CollectionEntry<"dictionary">[];
  }

  const { posts }: Props = $props();

  const pageSize = 10;

  let search = $state("");
  let visibleCount = $state(pageSize);
  let searchInput: HTMLInputElement;
  let loadTrigger: HTMLDivElement;

  onMount(() => {
    let params = new URLSearchParams(window.location.search);
    search = params.get("q")?.replaceAll("_", " ") ?? "";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          visibleCount = Math.min(visibleCount + pageSize, filteredPosts.length);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadTrigger);

    return () => observer.disconnect();
  });

  $effect(() => {
    // track search
    search;
    visibleCount = pageSize;
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
  const visiblePosts = $derived(filteredPosts.slice(0, visibleCount));
</script>

<svelte:document
  onkeydown={(e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === "Escape" && document.activeElement === searchInput) {
      if (search) {
        search = "";
      } else {
        searchInput.blur();
      }
    }
  }}
/>

<input autofocus bind:this={searchInput} type="search" id="search" bind:value={search} />

{#if filteredPosts.length}
  <center>
    Showing <b
      >{filteredPosts.length === posts.length
        ? `${posts.length}`
        : `${filteredPosts.length}/${posts.length}`}</b
    > words
  </center>
{:else}
  <center> Nothing found! You can request this word to be added:</center>
  <iframe
    title="Google Form"
    src="https://docs.google.com/forms/d/e/1FAIpQLSclWsDweTAcnVr6rN4SVehxKqDtrvrEMC-IWT4vC29N22hl5g/viewform?usp=pp_url&entry.17243220={search}&embedded=true"
    width="700"
    height="700"
    frameborder="0"
    marginheight="0"
    marginwidth="0">Loading…</iframe
  >
{/if}

{#each visiblePosts as post (post.id)}
  <section>
    <h2>{post.data.title}</h2>
    <DictPage {post} />
  </section>
{/each}

<div bind:this={loadTrigger}></div>

{#if visibleCount < filteredPosts.length}
  <div class="loading-more">
    Loading more... ({visibleCount}/{filteredPosts.length})
  </div>
{/if}

<style>
  .loading-more {
    text-align: center;
    color: var(--grey);
    margin: 1rem 0;
  }
</style>
