const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const mapsDirectory = path.join(__dirname, 'assets/archive/fortnite-maps');

app.get('/get-maps', async (req, res) => {
    try {
        const mapFolders = await getMapFolders(mapsDirectory);
        res.json(mapFolders);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

async function getMapFolders(dir) {
    let folders = await fs.readdir(dir);
    return Promise.all(folders.map(async folder => {
        let folderPath = path.join(dir, folder);
        let stat = await fs.stat(folderPath);
        if (stat.isDirectory()) {
            let images = await fs.readdir(folderPath);
            images = images.filter(image => ['.jpg', '.webp', '.png'].includes(path.extname(image).toLowerCase()));
            return {
                name: folder,
                images: images.map(image => path.join('assets/archive/fortnite-maps', folder, image))
            };
        } else {
            return null;
        }
    }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
