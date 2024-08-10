const fs = require('fs');
const path = require('path');

const imageGet = (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, '..', 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.send(data)
    } catch (error) {
        console.log(error);
    }
};

module.exports = imageGet