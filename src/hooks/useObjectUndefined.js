const checkObjectUndefined = (value, whitelist = []) => {
    let check;
    if (value === undefined || value === null || value === 0 || value === '') {
        check = true;
    } else if (Array.isArray(value) && value.length === 0) {
        check = true;
    } else if (typeof value === 'object') {
        const keys = Object.keys(value).filter(
            (key) => !whitelist.includes(key),
        );
        if (keys.length === 0) {
            return true;
        }
        const values = keys.map((key) => value[key]);
        check = values.some(
            (v) => v === undefined || v === null || v === 0 || v === '',
        );
    } else if (typeof value === 'string') {
        if (value.length === 0) {
            return true;
        }
    } else {
        check = false;
    }

    return check;
};

export default checkObjectUndefined;
