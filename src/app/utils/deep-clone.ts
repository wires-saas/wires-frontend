export const deepClone = (a: any): any => {
    return JSON.parse(JSON.stringify(a));
};
