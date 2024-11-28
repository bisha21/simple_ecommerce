// const logger = (req, res, next) => {
//     // template literals
//     console.log(`Method: ${req.method} \nUrl: ${req.originalUrl}`);
  
//       if (req.method === "DELETE") {
//         return res.status(405).send("Delete not allowed.");
//       }
  
//     next();
//   };
  
//   export default logger;