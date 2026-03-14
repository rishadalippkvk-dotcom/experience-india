const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'apps/client/src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(rootDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replacements
    content = content.replace(/@\/components\/ui/g, '@/shared/ui');
    content = content.replace(/@\/components\/Navbar/g, '@/shared/ui/Navbar');
    content = content.replace(/@\/components\/Footer/g, '@/shared/ui/Footer');
    // Handle relative imports too if any, but mostly we use @ aliases.
    // Move contexts
    content = content.replace(/@\/contexts/g, '@/app/providers');

    // Move hooks
    content = content.replace(/@\/hooks/g, '@/shared/hooks');

    // Move types
    content = content.replace(/@\/types/g, '@/shared/types');

    // Move lib/utils
    content = content.replace(/@\/lib\/utils/g, '@/shared/utils/utils');

    // Move data
    content = content.replace(/@\/data/g, '@/shared/data');

    // Sections (moved to features/home)
    // But wait, sections were imported in HomePage.tsx?
    // HomePage is now in features/home. So imports like `@/sections/HeroSection`...
    // sections folder contents were moved to features/home.
    // So `@/sections/HeroSection` should become `@/features/home/HeroSection`.
    content = content.replace(/@\/sections/g, '@/features/home');

    if (content !== originalContent) {
        console.log(`Updating imports in ${file}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});
