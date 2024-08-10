const fs = require('fs')
const path = require('path');

const imagePost = (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, '..', 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: "Downloaded"})
    } catch (error) {
        console.log(error);
        return res.status(500).json('error')
    }
};

module.exports = imagePost