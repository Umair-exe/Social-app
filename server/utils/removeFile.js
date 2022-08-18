const fs = require('fs').promises;

const removeFile = async (filename) => {
    try {
        await fs.unlink(`../server/uploads//${filename}`);
    } catch (e) {
        console.log(e);
    }
}


module.exports = { removeFile };
