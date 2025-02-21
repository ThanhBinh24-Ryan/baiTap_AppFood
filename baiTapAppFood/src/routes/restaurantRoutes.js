import express from 'express';
import { getRestaurantLikes, getUserLikes, unlikeRestaurant, likeRestaurant,  rateRestaurant,
    getRatingsByRestaurant,
    getRatingsByUser } from '../controllers/restaurantController.js';

const restaurantRoutes = express.Router();

restaurantRoutes.get("/getRestaurantLikes/:restaurantId", getRestaurantLikes); // Cần nhận restaurantId từ URL
restaurantRoutes.get("/getUserLikes/:userId", getUserLikes);  // Cần nhận userId từ URL

restaurantRoutes.post("/unlikeRestaurant", unlikeRestaurant);  // Cần nhận userId và restaurantId từ body
restaurantRoutes.post("/likeRestaurant", likeRestaurant);  // Cần nhận userId và restaurantId từ body
// API thêm đánh giá cho nhà hàng (userId, restaurantId, rating từ body)
restaurantRoutes.post("/rateRestaurant", rateRestaurant);  

// API lấy danh sách đánh giá của một nhà hàng theo restaurantId
restaurantRoutes.get("/getRatingsByRestaurant/:restaurantId", getRatingsByRestaurant);  

// API lấy danh sách đánh giá của người dùng theo userId
restaurantRoutes.get("/getRatingsByUser/:userId", getRatingsByUser);
export default restaurantRoutes;
