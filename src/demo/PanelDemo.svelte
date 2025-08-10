<script>
  import Panel from "../lib/Panel.svelte";

  import { removeURLParameter, returnHome } from "./utils/handleUrl.js";

  import { getContext } from "svelte";

  const demoObj = getContext("demoObj");

  // 将 panelOptions 声明为响应式状态
  let panelOptions = $state({
    template: `a a b
                c c b
                d e e`,
    splitSize: "5px",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    showDefaultColors: true,
    showDefaultText: true,
  });

  // 示例：在某个事件中修改 panelOptions
  // 假设你有一个按钮，点击后改变 template
  function changeTemplate() {
    const t1 = `a a b
                c c b
                d e e`;
    const c1 = "1fr 1fr 1fr";
    const r1 = "1fr 1fr 1fr";
    const t2 = `a b
                a c`;
    const c2 = "1fr 1fr";
    const r2 = "1fr 1fr";
    panelOptions.template = panelOptions.template == t1 ? t2 : t1;
    panelOptions.gridTemplateColumns = panelOptions.gridTemplateColumns == c1 ? c2 : c1;
    panelOptions.gridTemplateRows = panelOptions.gridTemplateRows == r1 ? r2 : r1;
    console.log("Template changed to a new layout.");
  }
</script>

<div class="container">
  <div class="top-bar">
    <button onclick={() => returnHome(demoObj)}> 返回主页 </button>
    <button onclick={changeTemplate}>更改布局</button>
  </div>
  <div class="panel">
    <Panel {...panelOptions} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }
  .top-bar {
    flex-shrink: 0;
  }
  /* 只对 Panel2 的根元素应用 flex: 1; */
  .panel {
    flex: 1;
  }
</style>
