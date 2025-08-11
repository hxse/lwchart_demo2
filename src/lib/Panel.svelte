<script>
  import { tick } from "svelte";
  import Split from "split-grid";
  import { getUniqueArray } from "./utils/array-utils.js";
  import { insertSplitSize } from "./utils/grid-template-utils.js";
  import { parseGridTemplateAreas } from "./utils/grid-area-parser.js";
  import { calculateSplitData } from "./utils/grid-split-calculator.js";
  import { calculateGridAreas } from "./utils/grid-area-calculator.js";
  import { transformGridAreas } from "./utils/grid-area-transformer.js";
  import { formatGridArea } from "./utils/grid-area-formatter.js";
  import { generateHslColors } from "./utils/color-generator.js";

  // 1. 获取所有响应式 props
  let props = $props();

  // 2. 将所有 props 直接作为派生状态的依赖
  let finalGridTemplateColumns = $derived(insertSplitSize(props.gridTemplateColumns, props.splitSize));
  let finalGridTemplateRows = $derived(insertSplitSize(props.gridTemplateRows, props.splitSize));
  let templateArray = $derived(props.template ? parseGridTemplateAreas(props.template) : null);
  let uniqueTemplateArray = $derived(templateArray ? getUniqueArray(templateArray) : []);
  let templateGrid = $derived(templateArray ? transformGridAreas(calculateGridAreas(templateArray)) : {});
  let hlsColors = $derived(
    props.showDefaultColors && uniqueTemplateArray
      ? generateHslColors(uniqueTemplateArray, { saturation: 50, lightness: 80, alpha: 1 })
      : [],
  );
  let splitData = $derived(templateArray ? calculateSplitData(templateArray) : null);

  // 用于存储 Split 实例，以便在更新时销毁旧实例
  let splitInstance = null;

  // 3. 将 DOM 操作和 Split.js 初始化放入 $effect
  // 这个 $effect 依赖于 splitData，它会自动更新
  $effect(() => {
    // 确保 splitData 存在
    if (!splitData) return;

    // 销毁旧的 Split 实例
    if (splitInstance) {
      splitInstance.destroy();
      splitInstance = null; // 确保实例被置空
    }

    // 在 tick() 之后确保 DOM 已更新
    tick().then(() => {
      const columnGuttersElements = splitData.columnGutters.map((g) => ({
        track: g.track,
        element: /** @type {HTMLElement} */ (document.querySelector(`.${g.name}`)),
      }));
      const rowGuttersElements = splitData.rowGutters.map((g) => ({
        track: g.track,
        element: /** @type {HTMLElement} */ (document.querySelector(`.${g.name}`)),
      }));

      splitInstance = Split({
        columnGutters: columnGuttersElements,
        rowGutters: rowGuttersElements,
      });
    });

    // 返回一个清理函数，确保在组件销毁时，实例能被正确清理
    return () => {
      if (splitInstance) {
        splitInstance.destroy();
        splitInstance = null;
      }
    };
  });
</script>

<div
  style={`
    display: grid;
    grid-template-columns: ${finalGridTemplateColumns};
    grid-template-rows: ${finalGridTemplateRows};
    height: 100%;
    width: 100%;

  `}
>
  {#each uniqueTemplateArray as item, index (item)}
    {@const Component = props.children[index].component}
    <div
      class={item}
      style="overflow: hidden; grid-area: {formatGridArea(templateGrid[item])}; background-color: {hlsColors[index]}; "
    >
      <Component {...props.children[index].props} />
    </div>
  {/each}

  {#if splitData?.allNames}
    {#each splitData.allNames as item (item.name)}
      <div class={item.name} style="grid-area:{item.gridArea};background-color: lightgray; cursor: grab;"></div>
    {/each}
  {/if}
</div>
