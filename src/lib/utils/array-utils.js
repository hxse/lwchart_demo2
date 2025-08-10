export function getUniqueArray(templateArray) {
    const uniqueArray = [...new Set(templateArray.flat())];
    return uniqueArray
}
