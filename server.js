const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fortnite-maps", (req, res) => {
  const mapsPath = path.join(__dirname, "public/assets/fortnite-maps");
  const categories = {};

  const subDirs = fs.readdirSync(mapsPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const reversedSubDirs = subDirs.sort().reverse();

  for (const subDir of reversedSubDirs) {
    const categoryPath = path.join(mapsPath, subDir);
    const images = [];

    const files = fs.readdirSync(categoryPath);

    const sortedFiles = files
      .filter(file => file.match(/\.(jpg|webp|png)$/i))
      .sort((a, b) => {
        const regex = /(\d+(\.\d+)?)/;
        const matchA = a.match(regex);
        const matchB = b.match(regex);

        if (matchA && matchB) {
          const numA = parseFloat(matchA[1]);
          const numB = parseFloat(matchB[1]);
          return numB - numA;
        }

        return 0;
      });

    for (const file of sortedFiles) {
      const imagePath = path.join("/assets/fortnite-maps", subDir, file);
      const imageTitle = file.replace(/\.(jpg|webp|png)$/i, "");

      images.push({
        path: imagePath,
        link: imagePath,
        title: imageTitle,
      });
    }

    categories[subDir] = images;
  }

  res.json(categories);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});