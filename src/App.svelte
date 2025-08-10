<script>
  import PanelDemo from "./demo/PanelDemo.svelte";
  import LWChartDemo from "./demo/LWChartDemo.svelte";
  import { onMount } from "svelte";
  import { setContext } from "svelte";

  let demoObj = $state({ current: "" });

  setContext("demoObj", demoObj);

  const demos = [
    {
      name: "PanelDemo",
      component: PanelDemo,
      title: "Panel Demo",
      description: "简单的Panel组件演示",
    },
    {
      name: "LWChartDemo",
      component: LWChartDemo,
      title: "LWChart Demo",
      description: "简单的LWChartDemo组件演示",
    },
  ];

  function getDemoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    demoObj.current = urlParams.get("demo") || "";
  }

  function navigateToDemo(demoName) {
    const url = new URL(window.location.href);
    if (demoName) {
      url.searchParams.set("demo", demoName);
    } else {
      url.searchParams.delete("demo");
    }
    window.history.pushState({}, "", url.toString());
    demoObj.current = demoName;
  }

  onMount(() => {
    getDemoFromUrl();
    window.addEventListener("popstate", getDemoFromUrl);
  });
</script>

<main>
  {#if demoObj.current}
    {#each demos as demo}
      {#if demo.name === demoObj.current}
        <demo.component />
      {/if}
    {/each}
  {:else}
    {#each demos as demo}
      <div class="demo-entry">
        <h2>{demo.title}</h2>
        <p>{demo.description}</p>
        <button onclick={() => navigateToDemo(demo.name)}>查看 {demo.title}</button>
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .demo-entry {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .demo-entry h2 {
    margin-top: 0;
    color: #333;
  }

  .demo-entry p {
    color: #666;
    flex-grow: 1;
  }

  .demo-entry button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 15px;
  }

  .demo-entry button:hover {
    background-color: #0056b3;
  }
</style>
