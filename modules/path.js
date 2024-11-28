import path from "path";
import url from "url";

const filePath = "./folder1/folder2/folder3/data.json";

// baseName()
// console.log(path.basename(filePath));

// // dirName()
// console.log(path.dirname(filePath));

// // parse()
console.log(path.parse(filePath));

// // extName()
// console.log(path.extname(filePath));

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log(__dirname);
// console.log(__filename);