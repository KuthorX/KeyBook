// TODO: 需要深入了解 async、await、Promise
export function saveEditDetail() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}
