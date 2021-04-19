const fastFolderSize = require('fast-folder-size');
const root = '../..';

fastFolderSize(root, (err, bytes) => {
    if (err) {
        throw err;
    }

    console.log(Math.abs(bytes / (1024 * 1024)).toFixed(2));
})