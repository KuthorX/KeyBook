// TODO: 需要深入了解 async、await、Promise 和 import、export
// 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export
export function saveEditDetail(detailData) {
    return new Promise(resolve => {
        setTimeout(() => {
            const r = Math.random();
            resolve(r > 0.5 ? true : false);
        }, 1000);
    });
}