import connect from "../models/connect.js";
import initModels from "../models/init-models.js";
const models = initModels(connect);

// Hàm thêm đơn đặt món
const addOrder = async (req, res) => {
    try {
        const { userId, foodId, amount, code, arrSubId } = req.body;

        // Kiểm tra xem các giá trị trong body có hợp lệ không
        if (!userId || !foodId || !amount || !code || !arrSubId) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Thêm đơn đặt món vào bảng order thông qua model Order
        await models.order.create({
            user_id: userId,
            food_id: foodId,
            amount: amount,
            code: code,
            arr_sub_id: arrSubId,  // Giá trị của arr_sub_id có thể là một chuỗi các ID con
            order_date: new Date()  // Thêm ngày giờ hiện tại
        });

        return res.send({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while placing order' });
    }
};


// Hàm lấy tất cả đơn đặt món của người dùng theo userId
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra xem userId có hợp lệ không
        if (!userId) {
            return res.status(400).send({ message: 'Missing userId' });
        }

        // Lấy tất cả các đơn đặt món của người dùng theo userId
        const orders = await models.order.findAll({
            where: {
                user_id: userId
            }
        });

        if (orders.length === 0) {
            return res.status(404).send({ message: 'No orders found for this user' });
        }

        return res.json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error while fetching user orders' });
    }
};

export {
    addOrder,
    getOrdersByUser
};
