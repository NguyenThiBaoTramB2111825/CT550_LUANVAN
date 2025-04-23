
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const MongoDB = require('../utils/mongodb.util'); 

router.get('/:productId', async (req, res) => {
    const productId = new ObjectId(req.params.productId);
    try {
        const ProductDetail = MongoDB.getClient().db().collection('productDetail');

        const productDetails = await ProductDetail.find({ product_id: (productId) }).toArray();
        console.log("Kết quả tìm kiếm với product_id:", productId, "=>", productDetails);

        if (productDetails.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm với product_id: ' + productId });
        }

        const ImportDetail = MongoDB.getClient().db().collection('importDetail');

        const importDetails = await ImportDetail.aggregate([
            {
                $lookup: {
                    from: 'productDetail',
                    localField: 'productDetail_id',
                    foreignField: '_id',
                    as: 'product_details'
                }
            },
            { $unwind: "$product_details" },
            { $match: { 'product_details.product_id': productId } },
            { $sort: { importDate: -1 } },
            { $limit: 1 }
        ]).toArray();

        console.log("Giá tri của importDetail: ", importDetails);

        if (importDetails.length > 0) {
            const price_import = importDetails[0].price_import;
            const suggestedPrice = price_import * 1.3;

            console.log(`Giá gợi ý cho sản phẩm ${productId}: ${suggestedPrice}`);
            return res.json({ suggestedPrice });
        } else {
            return res.json({ suggestedPrice: 0, message: "Sản phẩm chưa từng được nhập hàng" });
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin giá nhập:', error);
        return res.status(500).json(error.message);
    }
})
module.exports = router;

