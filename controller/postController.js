const Post = require("../model/postSchema");
const cloudinary = require("../middleware/cloudinary");

module.exports= {
  getProfile: async(req, res)=>{
   try {
    //find the login user using the id
    const posts = await Post.find({user: req.params.id})
     const user = req.user
      console.log(user)
      //if successful render the profile.ejs page 
     res.render("profile.ejs", {posts: posts, user: user })
   } catch (error) {
    console.error(error)
   }
  },
  getFeed: async(req, res) => {
    try {
        //find all posts in the db sort in descending order (time created at) lean fishing out the obj needed 
        const posts = await Post.find().sort({createdAt: "desc"}).lean()
        //successful... load feed page
         res.render("feed.ejs", {posts: posts})
    } catch (error) {
        console.error(error)       
    }
  }, 
   getPost: async(req, res) => {
   try {
     const posts = await Post.findById(req.params.id)
      const user = req.user
     res.render("post.ejs", {post: posts, user: user})
   } catch (error) {
    console.error(error)
   }
   },
   createPost: async(req, res) => {
    try {
        //upload images to cloudinary
        const results = await cloudinary.uploader.upload(req.file.path)
       await Post.create({
        title: req.body.title,
        image: results.secure_url,
        likes: 0,
        caption: req.body.caption,
        user: req.user.id,
        cloudinaryId: results.public_id
       })

       console.log('post created successful')
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

       await cloudinary.uploader.destroy(posts.cloudinaryId)
       await Post.deleteOne({_id: req.params.id})

       console.log('deleted')
       res.redirect('/profile')  
        } catch (error) {
      console.error(error)
    }
   }
}