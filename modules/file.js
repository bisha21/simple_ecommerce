import fs from 'fs/promises';

// fs.readFile('data.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   const res1 = data;  

//   fs.readFile(res1, 'utf8', (error, content) => {
//     if (error) {
//       console.error('Error reading the second file:', error);
//       return;
//     }
//     console.log(content);
//   });
// });

async function readMyFile() {
    const data= await fs.readFile('data.txt','utf8');
    console.log(data);
    const data2= await fs.readFile(data,'utf8');
    console.log(data2);
    
}
readMyFile();
