 const urltoFile = (url, filename, mimeType) => {
    return fetch(url)
        .then(function (res) {
            return res.arrayBuffer();
        })
        .then(function (buf) {
            return new File([buf], filename, { type: mimeType });
        });
};

export default urltoFile