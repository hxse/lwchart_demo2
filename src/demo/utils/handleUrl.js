
export function removeURLParameter(param) {
    // 获取当前的 URL
    const currentUrl = new URL(window.location.href);

    // 删除指定的参数
    currentUrl.searchParams.delete(param);

    // 使用 replaceState 修改 URL，不重新加载页面
    window.history.replaceState({}, "", currentUrl.href);
}
export function returnHome(demoObj) {
    demoObj.current = "";
    removeURLParameter("demo");
}
