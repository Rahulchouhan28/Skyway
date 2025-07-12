const fs = require('fs');
const https = require('https');
const path = require('path');

const destinations = [
  { name: 'newyork', query: 'new+york+city+skyline' },
  { name: 'paris', query: 'paris+eiffel+tower' },
  { name: 'tokyo', query: 'tokyo+skyline' },
  { name: 'dubai', query: 'dubai+skyline' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response
          .pipe(file)
          .on('finish', () => {
            file.close();
            console.log(`Downloaded: ${filepath}`);
            resolve();
          })
          .on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete the file if there was an error
            reject(err);
          });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
};

async function downloadDestinationImages() {
  const imageDir = path.join(__dirname, 'images');
  
  // Make sure images directory exists
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
    console.log('Created images directory');
  }
  
  // Download each destination image
  for (const dest of destinations) {
    const imageUrl = `https://source.unsplash.com/800x600/?${dest.query}`;
    const filePath = path.join(imageDir, `${dest.name}.jpg`);
    
    console.log(`Downloading ${dest.name} image...`);
    try {
      await downloadImage(imageUrl, filePath);
    } catch (err) {
      console.error(`Error downloading ${dest.name}: ${err.message}`);
    }
  }
  
  console.log('All images downloaded');
}

// Execute the download function
downloadDestinationImages(); 