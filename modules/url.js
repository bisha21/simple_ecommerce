import url from 'url';
const urlStrig='https://www.codeit.com.np/search-course?q=Node+JS'
const urlObj= new URL(urlStrig);
console.log(urlObj);
console.log(url.format(urlObj));
const param= new URLSearchParams(urlObj.search);
param.set("q" , "React js");
console.log(param);
