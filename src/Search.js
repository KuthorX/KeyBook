import {utc2timestamp} from './Tools';

export function SearchByText(text, allAccounts) {
    let tags = {};
    const allData = allAccounts;
    allData.map(data => {
        let tempTags = data.tags;
        tempTags = tempTags.split(" ");
        tempTags.map(tag => {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(data);
        });
    });

    const searchText = text;
    let newSet = new Set();
    for (let tag in tags) {
        if (tag.includes(searchText)) {
            let accounts = tags[tag];
            accounts.map(account => {
                newSet.add(account);
            });
        }
    }
    allData.map(account => {
        if (account.name.includes(searchText)) {
            newSet.add(account);
        }
    });

    let newArray = [];
    newSet.forEach(item => {
        newArray.push(item);
    });

    newArray.sort((a, b) => {
        return utc2timestamp(a["dateModify"]) - utc2timestamp(b["dateModify"]);
    })

    console.log(newArray)

    return newArray;
}
