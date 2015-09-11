var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var util = require("util");

var app = express();
  
 
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/bechdel/:imdbID", function(req, res){
 console.log("imdbID:" + req.params.imdbID);
  request.get("http://www.omdbapi.com/?&y=&plot=short&r=json&tomatoes=true&apikey=44112dd6&i="+req.params.imdbID, function(error, response, body){
    if(error) res.status(500).json(error);
      body = JSON.parse(body); 
      var imdbid = body.imdbID.replace("tt", "");
      
    request.get("http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid="+imdbid, function(err, resp, bod){
        if(err) res.status(501).json(err);
        bod = JSON.parse(bod);
          
      request.get("http://img.omdbapi.com/?apikey=44112dd6&h=250&i=" + imdbid, function(erro, respo, image){
//          console.log(body);
          if(erro) res.status(501).json(erro);
          res.json({
              imdbId: body.imdbID,
              title: body.Title,
              released: body.Released,
              year: body.Year,
              rated: body.Rated,
              runtime: body.Runtime,
              genre: body.Genre,
              director: body.Director,
              writer: body.Writer,
              actors: body.Actors,
              plot: body.Plot,
              imdbRating: body.imdbRating,
              awards: body.Awards,
              tomatoMeter: body.tomatoMeter,
              tomatoMeterUser: body.tomatoUserMeter,
              tomatoConsensus: body.tomatoConsensus,
              bechdelRating: bod.rating,
              bechdeldebatable: bod.dubious,
              posterUrl: body.Poster,
              //trailersArray: body.trailers.youtube
          })
     
      })
    })
  })
});

app.listen(8888, function(){
  console.log("Listening on 8888")
});