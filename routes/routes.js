// Routes
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// A GET route for scraping the echoJS website
module.exports = function(app) {
    app.get("/", (req, res) => {
        res.render('index');
    })

    app.get("/myarticles", (req, res) => {
        res.render("myarticles");
    })
    

    app.get("/savedarticles", (req, res) => {
      db.Article.find({saved: true}).then(data => {
        console.log(data);
        res.json(data);
      })
    })

    app.get("/scrape", (req, res) => {
        // First, we grab the body of the html with request
        axios.get("http://www.echojs.com/").then(response => {
          let $ = cheerio.load(response.data);
          $("article h2").each(function(i, element) {
            let result = {};
            result.title = $(this)
              .children("a")
              .text();
            result.link = $(this)
              .children("a")
              .attr("href");
            db.Article.create(result)
              .catch(function(err) {
                 return res.json(err);
              });
          });
          db.Article.find({}).then(data => {
            res.json(data);
          });
          
        });
      });
      
           
      // Route for grabbing a specific Article by id, populate it with it's note
      app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
      
      // Route for saving/updating an Article's associated Note
      app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        console.log(req.body);
        db.Article.update({_id: req.params.id}, req.body)
          .then(function(data) {
            console.log(data)
            res.status(200);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
}

