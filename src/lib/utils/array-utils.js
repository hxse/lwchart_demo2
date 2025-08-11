export function getUniqueArray(templateArray) {
    const uniqueArray = [...new Set(templateArray.flat())];
    return uniqueArray
}
/**
 * 比较两个扁平对象是否相等。
 *
 * @param {object} obj1 第一个对象。
 * @param {object} obj2 第二个对象。
 * @returns {boolean} 如果两个对象相等，返回 true，否则返回 false。
 */
export function areObjectsEqual(obj1, obj2) {
    // 快速检查：如果引用相同，它们必然相等
    if (obj1 === obj2) {
        return true;
    }

    // 检查键的数量是否相同
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }

    // 遍历键值对，逐一比较
    for (const key of keys1) {
        // 检查 obj2 中是否有相同的键，以及对应的值是否相等
        if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

/**
 * 根据新旧数据，确定 Lightweight Charts 的更新策略。
 *
 * @param {Array<object>} oldData 旧的数据数组。
 * @param {Array<object>} newData 新的数据数组。
 * @returns {string} 返回 "setData", "updateData" 或 "nothing"。
 */
export function resolveDataUpdate(oldData, newData) {
    const oldLen = oldData.length;
    const newLen = newData.length;

    // 如果新旧数据长度都为0，无需操作
    if (oldLen === 0 && newLen === 0) {
        return "nothing";
    }

    const oldFirst = oldData[0];
    const newFirst = newData[0];
    const oldLast = oldData[oldLen - 1];
    const newLast = newData[newLen - 1];
    const oldLast2 = oldData[oldLen - 2];
    const newLast2 = newData[newLen - 2];

    if (!oldFirst || !newFirst || !oldLast || !newLast || !oldLast2 || !newLast2) {
        return "setData"
    }

    if (!areObjectsEqual(oldFirst, newFirst)) {
        return "setData"
    }

    // 1. 如果新旧数据长度相等
    if (oldLen === newLen) {
        if (!areObjectsEqual(oldLast2, newLast2)) {
            return "setData"
        }
        // 比较最后一个数据项
        if (!areObjectsEqual(oldLast, newLast)) {
            // 最后一个数据项不同，说明是更新
            return "updateData";
        }

        // 如果长度和最后一个数据项都相同，则假定数据未变
        return "nothing";
    }
    // 2. 如果新数据比旧数据多1个
    else if (newLen - oldLen === 1) {
        if (!areObjectsEqual(oldLast, newLast2)) {
            return "setData";
        }
        // 第一个和倒数第二个都相同，说明新数据只是在末尾追加了一个新项
        return "updateData";
    }
    return "setData";
}
