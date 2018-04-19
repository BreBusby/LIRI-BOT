var Twitter = require("twitter");

var twitterKeysFile = require("./keys.js");

var spotify = require("spotify");

var request = require("request");

var fs = require("fs");

var filename = './log.txt';

var log = require('simple-node-logger').createSimpleFileLogger( filename );

log.setLevel('all');

var action = process.argv[2];

var argument = "";

doSomething(action, argument);


switch (action) {

    case "my-tweets": 
    getMyTweets();
    break;

    case "spotify-this-song":
    
    var songTitle = argument;

    if (songTitle === "") {
        lookupSpecificSong();

    } else {
        getSongInfo(songTitle);
    }
    break;

    case "movie-this":

    var movieTitle = argument;

    if (movieTitle === "") {
        getMovieInfo("Mr. Nobody");


    } else {
        getMovieInfo(movieTitle);
    }
    break;

    case "do-what-it-says": 
    doWhatItSays();
    break;
}

function getMyTweets() {

	var client = new Twitter(twitterKeysFile.twitterKeys);

	var params = {q: "@BBSMU18", count: 5};

	
	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {

	  	for (var i = 0; i < tweets.statuses.length; i++) {
	  		var tweetText = tweets.statuses[i].text;
	  		logOutput("Tweet Text: " + tweetText);
	  	}
	  } else {
	  	logOutput(error);
	  }
	});
}

function getSongInfo(songTitle) {


	spotify.search({type: 'track', query: songTitle}, function(err, data) {
		if (err) {
			logOutput.error(err);
			return
		}
		var artistsArray = data.tracks.items[0].album.artists;

		var artistsNames = [];

		for (var i = 0; i < artistsArray.length; i++) {
			artistsNames.push(artistsArray[i].name);
		}

		logOutput("Artist(s): " + artists);
		logOutput("Song: " + data.tracks.items[0].name)
		logOutput("Spotify Preview URL: " + data.tracks.items[0].preview_url)
		logOutput("Album Name: " + data.tracks.items[0].album.name);
	});
	
}

function getMovieInfo(movieTitle) {

	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&tomatoes=true&r=json";

	request(queryUrl, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

	    var movie = JSON.parse(body);
	    logOutput("Movie Title: " + movie.Title);
	    logOutput("Release Year: " + movie.Year);
	    logOutput("IMDB Rating: " + movie.imdbRating);
	    logOutput("Country Produced In: " + movie.Country);
	    logOutput("Language: " + movie.Language);
	    logOutput("Plot: " + movie.Plot);
	    logOutput("Actors: " + movie.Actors);

	  }
	});
}