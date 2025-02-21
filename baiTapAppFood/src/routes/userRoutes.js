import express from 'express'
import {    addOrder,
    getOrdersByUser} from '../controllers/userController.js';
    const userRoutes = express.Router();
    userRoutes.get("/getOrdersByUser/:userId", getOrdersByUser);  

    userRoutes.post("/addOrder",addOrder);  
export default userRoutes;