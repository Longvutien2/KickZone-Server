import Product from '../models/product';


export const listProduct = async  (request, response) => {
    try {
        const product = await Product.find().exec();
        response.json(product);

    } catch (error) {
        response.status(400).json({message: "Không tìm thấy data"})
    }
}

export const productDetail = async  (request ,response) => {
    try {
        const product = await Product.findOne({_id:request.params.id}).exec()
        response.json(product);
    } catch (error) {
        response.status(400).json({message: "Không tìn thấy data"})
    }
    // response.json(products.find(item => item.id === +request.params.id));
}

export const addProduct = async (request, response) => { 
    try {
        const product = await Product(request.body).save();
        response.json(product);
    } catch (error) {
        response.status(400).json({message:"Không thể tạo mới sản phẩm"});
    }
    // response.json(products.push(request.body));
}

export const deleteProduct = async (request, response) => {
    try {
        const product = await Product.findOneAndDelete({_id: request.params.id});
        response.json(product);
    } catch (error) {
        response.status(400).json({message:"Không thể xóa"});
    }
   
}

export const updateProduct = async (request, response) => {
    try {
        const product = await Product.findOneAndUpdate({_id: request.params.id}, request.body, {new: true});
        response.json(product);

    } catch (error) {
        response.status(400).json({message:"Không thể sửa"});
    }
  
}