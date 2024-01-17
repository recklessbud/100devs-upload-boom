const Post = require("../model/postSchema");
const cloudinary = require("../middleware/cloudinary");

module.exports= {
  getProfile: async(req, res)=>{
   try {
    //find the login user using the id
    const post = await Post.find({user: req.params.id})
     const user = req.user
      console.log(user)
      //if successful render the profile.ejs page 
     res.render("profile.ejs", {post: post, user: user })
   } catch (error) {
    console.error(error)
   }
  },
  getFeed: async(req, res) => {
    try {
        //find all posts in the db sort in descending order (time created at) lean fishing out the obj needed 
        const posts = await Post.find().sort({createdAt: "desc"}).lean()
        //successful... load feed page
         res.render("feed.ejs", {post: posts})
    } catch (error) {
        console.error(error)       
    }
  }, 
   getPost: async(req, res) => {
   try {
     const posts = await Post.findById({user: req.params.id})
      const user = req.user
     res.render("posts.ejs", {post: posts, user: user})
   } catch (error) {
    console.error(error)
   }
   },
   createPost: async(req, res) => {
    try {
        //upload images to cloudinary
        const results = cloudinary.uploader.upload(req.file.path)
       await Post.create({
        title: req.body.title,
        image: results.secure_url,
        likes: 0,
        caption: req.body.caption,
        user: req.user.id,
        cloudinaryId: results.public_id
       })

       console.log('post created sucessfully')
       res.redirect("/profile")
    } catch (error) {
        console.error(error)
    }
   },
   likePost: async(req, res) => {
    try {
        const posts = await Post.findOneAndUpdate({
          _id: req.params.id}, {$inc: {likes:1}},)
          console.log("post liked")

          res.redirect(`/post/${req.params.id}`)
    } catch (error) {
        console.error(error)
    }
   },
   deletePost: async(req, res) => {
    try {
       const posts = await Post.findById({_id: req.params.id})

       await cloudinary.uploader.destroy(post.cloudinaryId)
       await Post.remove({_id: req.params.id})

       console.log('deleted')
       res.redirect('/profile')  
        } catch (error) {
      
    }
   }
}