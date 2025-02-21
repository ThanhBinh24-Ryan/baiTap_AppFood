import express from 'express';

// lưu ý: khi import thì phải có đuôi .js
import restaurantRoutes from './restaurantRoutes.js';
import userRoutes from './userRoutes.js';


const rootRoutes = express.Router();

// import userRoutes vào rootRoutes
// http://localhost:3000/.....
rootRoutes.use("/restaurants", restaurantRoutes);
rootRoutes.use("/users", userRoutes);




export default rootRoutes;