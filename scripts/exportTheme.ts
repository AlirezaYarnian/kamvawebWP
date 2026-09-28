import fs from 'fs';
import path from 'path';
import { themeCodeFiles } from '../src/data/themeFiles.js';

const targetDir = path.resolve(process.cwd(), 'kamva-theme');

console.log(`Writing WordPress theme files to: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

themeCodeFiles.forEach((file) => {
  const filePath = path.join(targetDir, file.path);
  const dirName = path.dirname(filePath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  fs.writeFileSync(filePath, file.content.trim() + '\n', 'utf-8');
  console.log(`✓ Created: ${file.path}`);
});

console.log('\nAll PHP and WordPress Theme files written successfully!');
