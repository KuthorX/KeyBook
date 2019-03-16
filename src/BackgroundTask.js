// TODO: 需要深入了解 async、await、Promise 和 import、export
// 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export
export function saveEditDetail(detailData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}