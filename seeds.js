const { Mongoose } = require("mongoose");

const mongosse = require("mongoose"),
      Content = require("./models/content"),
      Comment = require("./models/comment");

      var seeds = [
          {title: "Number One", image: "https://images.unsplash.com/photo-1594012487062-cfdf01df1d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"},
          {title: "Number Two", image: "https://images.unsplash.com/photo-1594474716318-9c4d3bacf94b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"},
          {title: "Number Three", image: "https://images.unsplash.com/photo-1594786118579-95ba90c801ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"}
      ]
async function seedDB() {
    await Comment.deleteMany({});
    console.log("Comment removed");
    await Content.deleteMany({});
    console.log("Content removed");
    for(const seed of seeds){
        let content = await Content.create(seed);
        console.log("Content created");
        let comment = await Comment.create(
            {
                text: "what's goin' on here?",
                author: "Crwford"
            }
        )
        console.log("Comment created");
        content.comments.push(comment);
        content.save();
        console.log("Comment added to content");
    }
}
module.exports = seedDB;
