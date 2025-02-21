import connect from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";

const models = initModels(connect);

// API để like nhà hàng
const likeRestaurant = async (req, res) => {
    try {
        const { userId, restaurantId } = req.body; // Lấy userId và restaurantId từ body request

        // Kiểm tra xem người dùng đã "like" nhà hàng này chưa
        const [existingLike] = await connect.query(`
            SELECT * FROM like_res WHERE user_id = ? AND res_id = ?
        `, {
            replacements: [userId, restaurantId],
            type: connect.QueryTypes.SELECT
        });

        if (existingLike) {  // Kiểm tra nếu đã có like từ trước
            return res.status(400).send({ message: 'You have already liked this restaurant!' });
        }

        // Thêm "like" vào bảng like_res
        await connect.query(`
            INSERT INTO like_res (user_id, res_id, date_like) VALUES (?, ?, NOW())
        `, {
            replacements: [userId, restaurantId],
            type: connect.QueryTypes.INSERT
        });

        return res.send({ message: 'Restaurant liked successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while liking the restaurant' });
    }
}


// API để unlike nhà hàng
const unlikeRestaurant = async (req, res) => {
    try {
        const { userId, restaurantId } = req.body; // Lấy userId và restaurantId từ body request

        // Kiểm tra nếu người dùng đã "like" nhà hàng này
        const [existingLike] = await connect.query(`
            SELECT * FROM like_res WHERE user_id = ? AND res_id = ?
        `, {
            replacements: [userId, restaurantId],
            type: connect.QueryTypes.SELECT
        });

        if (existingLike.length === 0) {
            return res.status(400).send({ message: 'You have not liked this restaurant!' });
        }

        // Xóa lượt "like" trong bảng like_res
        await connect.query(`
            DELETE FROM like_res WHERE user_id = ? AND res_id = ?
        `, {
            replacements: [userId, restaurantId],
            type: connect.QueryTypes.DELETE
        });

        return res.send({ message: 'Restaurant unliked successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while unliking the restaurant' });
    }
}

// API lấy danh sách likes của người dùng
const getUserLikes = async (req, res) => {
    try {
        const userId = req.params.userId;  // Lấy userId từ tham số URL

        const [data] = await connect.query(`
            SELECT r.res_name, r.image, r.desc, l.date_like
            FROM like_res l
            JOIN restaurant r ON l.res_id = r.res_id
            WHERE l.user_id = ?
            ORDER BY l.date_like DESC
        `, {
            replacements: [userId],
            type: connect.QueryTypes.SELECT
        });

        return res.send({ data });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while fetching user likes' });
    }
}

// API lấy danh sách người dùng đã like một nhà hàng
const getRestaurantLikes = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;  // Lấy restaurantId từ tham số URL

        const [data] = await connect.query(`
            SELECT u.full_name, u.email, l.date_like
            FROM like_res l
            JOIN user u ON l.user_id = u.user_id
            WHERE l.res_id = ?
            ORDER BY l.date_like DESC
        `, {
            replacements: [restaurantId],
            type: connect.QueryTypes.SELECT
        });

        return res.send({ data });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while fetching restaurant likes' });
    }
}
const rateRestaurant = async (req, res) => {
    try {
        const { userId, restaurantId, rating } = req.body;

        // Kiểm tra xem người dùng đã đánh giá nhà hàng này chưa
        const [existingRating] = await connect.query(`
            SELECT * FROM rate_res WHERE user_id = ? AND res_id = ?
        `, {
            replacements: [userId, restaurantId],
            type: connect.QueryTypes.SELECT
        });

        if (existingRating) {
            return res.status(400).send({ message: 'You have already rated this restaurant!' });
        }

        // Thêm đánh giá vào bảng rate_res
        await connect.query(`
            INSERT INTO rate_res (user_id, res_id, amount, date_rate) 
            VALUES (?, ?, ?, NOW())
        `, {
            replacements: [userId, restaurantId, rating],
            type: connect.QueryTypes.INSERT
        });

        return res.send({ message: 'Rating submitted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while submitting rating' });
    }
};

const getRatingsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Lấy tất cả các đánh giá của nhà hàng theo restaurantId
        const ratings = await connect.query(`
            SELECT r.*, u.full_name FROM rate_res r
            JOIN user u ON r.user_id = u.user_id
            WHERE r.res_id = ?
        `, {
            replacements: [restaurantId],
            type: connect.QueryTypes.SELECT
        });

        return res.json(ratings);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while fetching ratings' });
    }
};

const getRatingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Lấy tất cả các đánh giá của người dùng theo userId
        const ratings = await connect.query(`
            SELECT r.*, res.res_name FROM rate_res r
            JOIN restaurant res ON r.res_id = res.res_id
            WHERE r.user_id = ?
        `, {
            replacements: [userId],
            type: connect.QueryTypes.SELECT
        });

        return res.json(ratings);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while fetching user ratings' });
    }
};


export {
    getRestaurantLikes,
    getUserLikes,
    unlikeRestaurant,
    likeRestaurant,
    rateRestaurant,
    getRatingsByRestaurant,
    getRatingsByUser
}
