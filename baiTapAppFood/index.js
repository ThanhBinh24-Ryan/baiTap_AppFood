import express from 'express';
import connect from './db.js';
import rootRoutes from './src/routes/rootRoutes.js';
const app = express();
// parse body từ string => JSON
app.use(express.json());
// import rootRoutes
app.use(rootRoutes);
app.get("/welcome", (req, res) => {
    // trả dữ liệu về cho client (FE, postman,...)
    // dùng res
    return res.send("welcome to node48");
})
const port = 3000;
// param1: port
// param2: callback function
// () => {}: style define function theo kiểu ES6
app.listen(port, () => {
    console.log(`BE is running with port ${port}`);
})
// npx sequelize-auto -h localhost -d Food_App -u root -x 123456 -p 3307 --dialect mysql -o src/models -l esm