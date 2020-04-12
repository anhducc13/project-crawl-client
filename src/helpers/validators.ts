import validator from 'validator';

export const validateListURL = (_: any, value: string) => {
    if (value) {
        if (value.includes(' ')) {
            return Promise.reject('Không được chứa khoảng trắng');
        }
        const arrLink = value.split(',');
        let errLink: string[] = [];
        arrLink.map((item: string) => {
            if (!validator.isURL(item)) {
                errLink.push(item);
            }
            return item;
        });
        if (errLink.length) {
            const msgErr = errLink.join(', ');
            return Promise.reject(`URL ${msgErr} sai định dạng`);
        }
        return Promise.resolve();
    }
    return Promise.reject('Vui lòng nhập đúng định dạng URL');
};
