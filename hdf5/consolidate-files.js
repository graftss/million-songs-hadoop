const fs = require('fs');
const path = require('path');

const dataRootPath = '../data';
const outDir = 'in';

const findAll = (dir, filter = () => true, result = []) => {
  fs.readdirSync(dir).forEach(file => {
    const child = path.join(dir, file);

    fs.statSync(child).isDirectory()
      ? findAll(child, filter, result)
      : (filter(child) && result.push(child));
  });

  return result;
};

const files = findAll(dataRootPath);

files.forEach(filePath => {
  const base = filePath.match(/[\w\d]+\.h5$/)[0];
  const outPath = path.join(__dirname, outDir, base);
  const isThere = fs.existsSync(outPath);
  if (!isThere) {
    fs.copyFileSync(filePath, outPath);
    console.log(outPath, 'copied');
  }
});
