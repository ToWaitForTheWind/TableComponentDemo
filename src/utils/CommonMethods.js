// 高亮筛选字段
export function filterShowName (val, searchKey) {
    if (!searchKey || !val) return val;
    let splitArr = String(val).split(searchKey);
    let resArr = [];
    splitArr.forEach((item, index) => {
        if (item !== '') resArr.push({ val: item, type: 'normal' });
        if (index < splitArr.length - 1) resArr.push({ val: searchKey, type: 'matched' });
    });
    return resArr;
}

// 生成随机ID
export const generateId = function () {
    return Math.floor(Math.random() * 10000);
};
