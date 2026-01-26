export const GlobalWorkerOptions = {
    workerSrc: ''
};

export const getDocument = () => ({
    promise: Promise.resolve({
        numPages: 1,
        getPage: () => Promise.resolve({
            getTextContent: () => Promise.resolve({ items: [] })
        })
    })
});
