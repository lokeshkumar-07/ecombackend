import Product from '../models/Product.js'
import cloudinary from '../utils/cloudinary.js'
import multer from 'multer'


export const createProduct = async (req,res,next) => {
    try{
        
        let images = [];
        const upload = multer()

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
            width: 800,
            crop: "scale",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        req.body.images = imagesLinks;
        req.body.userId = req.userId;
      
        const product = await Product.create(req.body);
      
        res.status(201).send(product);

    }catch(err){
        next(err)
    }
}

export const updateProduct = async (req,res,next) => {
    try{
        console.log(req.body)
        const product = await Product.findByIdAndUpdate({_id: req.params.productId}, {...req.body.formData}, {new: true})
        console.log(product)
        res.status(200).send(product)

    }catch(err){
        next(err)
    }
}

export const getProduct = async (req,res,next) => {
  try{
      
      const product = await Product.findById(req.params.productId)


      res.status(200).send(product)

  }catch(err){
      next(err)
  }
}

export const getAllProduct = async (req,res,next) => {
    
    try{
        
        const page = req.query.page -1 || 0
        const limit = req.query.limit || 5
        const search = req.query.search || ""
        let sort = req.query.sort 
        let category = req.query.category || "All"
        const minPrice = req.query.minPrice || 0; // Minimum price filter
        const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
        
        const categoryOptions = [
          "Fruits",
          "Vegatibles",
          "Meat",
          "Milk and Diary",
          "Dry Fruits",
          "Oil and Masala",
        ]

        category === "All" ? (category = [...categoryOptions]) : (category = req.query.category.split(","))
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {}

        if(sort[1] && sort[1] !== "default"){
          sortBy[sort[0]] = sort[1]
        }

        const products = await Product.find({
                        name: {$regex: search, $options: "i"},
                        price: {$gte: minPrice, $lte: maxPrice}
                      })
                      .where("category")
                      .in([...category])
                      .sort(sortBy)
                      .skip(page * limit)
                      .limit(limit)
        
        
        const total = await Product.countDocuments({
          category: {$in: [...category]},
          name:{ $regex: search, $options: "i"},
          price: {$gte: minPrice, $lte: maxPrice}
        })

        res.status(200).send({
          products: products,
          total: total 
        })
        
    }catch(err){
        next(err)
    }
}


export const getAdminProduct = async (req,res,next) => {
    
  try{
      
      const page = req.query.page -1 || 0
      const limit = req.query.limit || 5
      const search = req.query.search || ""
      let sort = req.query.sort 
      let category = req.query.category || "All"
      const minPrice = req.query.minPrice || 0; // Minimum price filter
      const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;

      const categoryOptions = [
        "Fruits",
        "Vegatibles",
        "Meat",
        "Milk and Diary",
        "Dry Fruits",
        "Oil and Masala",
      ]

      category === "All" ? (category = [...categoryOptions]) : (category = req.query.category.split(","))
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {}

      if(sort[1] && sort[1] !== "default"){
        sortBy[sort[0]] = sort[1]
      }

      const products = await Product.find({
                      name: {$regex: search, $options: "i"},
                      price: {$gte: minPrice, $lte: maxPrice}
                    })
                    .where("category")
                    .in([...category])
                    .sort(sortBy)
                    .skip(page * limit)
                    .limit(limit)
      
      
      const total = await Product.countDocuments({
        category: {$in: [...category]},
        name:{ $regex: search, $options: "i"},
        price: {$gte: minPrice, $lte: maxPrice}
      })

      res.status(200).send({
        products: products,
        total: total 
      })
      
  }catch(err){
      next(err)
  }
}

