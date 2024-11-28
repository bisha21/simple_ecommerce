import { error } from "console";
import fs from "fs/promises";
fs.readFile("../data/users.json","utf-8").then((data)=>{
const user= JSON.parse(data);
// console.log(user)
fs.readFile("../data/posts.json","utf-8").then((data)=>{
    const post= JSON.parse(data);
    // console.log(post);
    
    const result = user.map((user) => {
        return post.filter((post) => post.userId === user.id);
    })
    console.log(result);

}).catch((err)=>console.log(err))
}).catch((error)=>console.log(error));