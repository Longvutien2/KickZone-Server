import category from "../models/category"
import product from "../models/product";

export const  listCategoeies = async (req, res) => {
    try {
        const categories = await category.find().exec();
        res.json(categories);
    } catch (error) {
        res.status(400).json({message:"Không tìm thấy "});
    }
}

export const addCategory = async (req, res) => {
    try {
        const categories = await category(req.body).save();
        res.json(categories);
    } catch (error) {
        res.status(400).json({message:"Không thêm được"});
    }
}
export const listCategoryDetail = async (req, res) => {
    try {
        const categories = await category.findOne({_id:req.params.id}).exec();
        const products = await product.find({category: categories}).exec()
        // const products = await product.find({categories}).populate("category").exec();
        res.json({categories, products});
       
    } catch (error) {
        res.status(400).json({message:"Không tìm thấy sản phẩm"});
    }
}

export const editCategory = async (req, res) => {
    try {
        const categories = await category.findOneAndUpdate({id:req.param._id}, req.body , {new:true} );
        res.json(categories);
    } catch (error) {
        res.status(400).json({message:"Sửa thất bại"});
    }
}

export const removeCategory = async (req, res) => {
    try {
        const categories = await category.findOneAndDelete({id:req.param._id});
        res.json(categories);
    } catch (error) {
        
    }
}