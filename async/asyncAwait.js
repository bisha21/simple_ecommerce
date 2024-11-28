import fs from "fs/promises";

async function getPosts() {
  try {
    const rawUsers = await fs.readFile("../data/users.json", "utf8");
    const rawPosts = await fs.readFile("../data/posts.json", "utf8");
    const rawComments = await fs.readFile("../data/comments.json", "utf8");

    const users = JSON.parse(rawUsers);
    const posts = JSON.parse(rawPosts);
    const comments = JSON.parse(rawComments);

    console.log(users);
    console.log(posts);
    console.log(comments);

    const result = users.map((user) => {
      return posts.filter((post) => post.userId === user.id);
    });

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

getPosts();