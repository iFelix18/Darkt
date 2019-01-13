// Recommended in combination with Darkt, my darker theme for Trakt.
// More info on: https://git.io/Darkt

// ==UserScript==
// @name            Ratings on Trakt
// @name:it         Valutazioni su Trakt
// @author          Felix
// @namespace       https://github.com/iFelix18
// @description     Adds ratings from IMDb, Rotten Tomatoes and Metacritic to Trakt
// @description:it  Aggiunge valutazioni da IMDb, Rotten Tomatoes e Metacritic a Trakt
// @copyright       2018, Felix (https://github.com/iFelix18)
// @license         CC-BY-SA-4.0; https://creativecommons.org/licenses/by-sa/4.0/
// @license         GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version         1.1.4
// @icon            https://api.faviconkit.com/trakt.tv/64
// @homepageURL     https://github.com/iFelix18/Darkt/blob/master/userscripts/README.md
// @supportURL      https://github.com/iFelix18/Darkt/issues
// @updateURL       https://raw.githubusercontent.com/iFelix18/Darkt/master/userscripts/ratings-on-trakt.meta.js
// @downloadURL     https://raw.githubusercontent.com/iFelix18/Darkt/master/userscripts/ratings-on-trakt.user.js
// @include         https://trakt.tv/movies/*
// @include         https://trakt.tv/shows/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://openuserjs.org/src/libs/soufianesakhi/node-creation-observer.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @run-at          document-idle
// ==/UserScript==

(function () {
    'use strict';

    NodeCreationObserver.onCreation("#summary-wrapper .summary .container h1", ratingsOnTrakt);

    function ratingsOnTrakt() {

        // settings
        GM_config.init({
            "id": "MyConfig",
            "title": "Ratings on Trakt - Settings",
            "fields": {
                "apikey": {
                    "label": "OMDb API Key",
                    "section": ["You can request a free OMDb API Key at:", "https://www.omdbapi.com/apikey.aspx"],
                    "type": "text",
                    "default": ""
                }
            },
            "css": "#MyConfig {background-color: #1D1D1D; color: #FFF;} #MyConfig .reset, #MyConfig .reset a {color: #FFF;} #MyConfig .section_header {background-color: #3A3A3A; border: 1px solid #3A3A3A;} #MyConfig .section_desc {background-color: #3A3A3A; color: #FFF; border: 1px solid #3A3A3A;}",
            "events": {
                "save": function () {
                    alert("API Key saved!");
                    location.reload();
                }
            }
        });

        // settings on add-on menu
        GM_registerMenuCommand("Ratings on Trakt - Configure", function () {
            GM_config.open();
        });

        //fix CSS
        $("#summary-ratings-wrapper ul li").css("margin", "0 21px 0 0");
        $("#summary-ratings-wrapper ul.stats").css("margin-left", "0px");

        // omdb api key
        var apikey = GM_config.get("apikey");
        if (apikey == "") {
            GM_config.open();
        }
        console.log("OMDb API Key: " + apikey);

        // get IMDb ID from trakt
        var IMDbID = $("a[href*='imdb']").attr("href").match(/tt\d+/)[0];
        console.log("IMDb ID: " + IMDbID);

        // add IMDb rating on trakt
        var addIMDbRating = function (rating, votes) {
            // IMDb logo
            var IMDb_logo = document.createElement("img");
            IMDb_logo.classList.add("IMDb", "logo");
            IMDb_logo.src = "https://ia.media-imdb.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@._V1_.png";

            // IMDb icon
            var IMDb_icon = document.createElement("div");
            IMDb_icon.classList.add("icon");
            IMDb_icon.appendChild(IMDb_logo);

            // IMDb rating
            var IMDb_rating = document.createElement("div");
            IMDb_rating.classList.add("rating");
            IMDb_rating.innerHTML = rating;

            // IMDb votes
            var IMDb_votes = document.createElement("div");
            IMDb_votes.classList.add("votes");
            IMDb_votes.innerHTML = votes + "k";

            // IMDb number
            var IMDb_number = document.createElement("div");
            IMDb_number.classList.add("number");
            IMDb_number.appendChild(IMDb_rating);
            IMDb_number.appendChild(IMDb_votes);

            // IMDb rated-text
            var IMDb_rated_text = document.createElement("div");
            IMDb_rated_text.classList.add("rated-text");
            IMDb_rated_text.appendChild(IMDb_icon);
            IMDb_rated_text.appendChild(IMDb_number);

            // IMDb rating
            var IMDb = document.createElement("li");
            IMDb.classList.add("IMDb-rating");
            IMDb.appendChild(IMDb_rated_text);
            IMDb.style.marginRight = "21px";

            //add IMDb rating to the page
            var ratings = document.getElementsByClassName("ratings")[0];
            if (ratings) {
                ratings.appendChild(IMDb);
            }
        };

        // add Rotten Tomatoes rating
        var addRottenTomatoesRating = function (rating, tomato) {
            // Rotten Tomatoes logo
            var RottenTomatoes_logo = document.createElement("img");
            RottenTomatoes_logo.classList.add("RottenTomatoes", "logo");
            if (tomato === "Fresh") {
                RottenTomatoes_logo.src = "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/global/new-fresh-lg.12e316e31d2.png";
            } else {
                RottenTomatoes_logo.src = "https://www.rottentomatoes.com/assets/pizza-pie/images/icons/global/new-rotten-lg.ecdfcf9596f.png";
            }

            // Rotten Tomatoes icon
            var RottenTomatoes_icon = document.createElement("div");
            RottenTomatoes_icon.classList.add("icon");
            RottenTomatoes_icon.appendChild(RottenTomatoes_logo);

            // Rotten Tomatoes rating
            var RottenTomatoes_rating = document.createElement("div");
            RottenTomatoes_rating.classList.add("rating");
            RottenTomatoes_rating.innerHTML = rating;

            // Rotten Tomatoes vote
            var RottenTomatoes_votes = document.createElement("div");
            RottenTomatoes_votes.classList.add("votes");
            RottenTomatoes_votes.innerHTML = tomato;

            // Rotten Tomatoes number
            var RottenTomatoes_number = document.createElement("div");
            RottenTomatoes_number.classList.add("number");
            RottenTomatoes_number.appendChild(RottenTomatoes_rating);
            RottenTomatoes_number.appendChild(RottenTomatoes_votes);

            // Rotten Tomatoes rated-text
            var RottenTomatoes_rated_text = document.createElement("div");
            RottenTomatoes_rated_text.classList.add("rated-text");
            RottenTomatoes_rated_text.appendChild(RottenTomatoes_icon);
            RottenTomatoes_rated_text.appendChild(RottenTomatoes_number);

            // Rotten Tomatoes rating
            var RottenTomatoes = document.createElement("li");
            RottenTomatoes.classList.add("RottenTomatoes-rating");
            RottenTomatoes.appendChild(RottenTomatoes_rated_text);
            RottenTomatoes.style.marginRight = "21px";

            //add Rotten Tomatoes rating to the page
            var ratings = document.getElementsByClassName("ratings")[0];
            if (ratings) {
                ratings.appendChild(RottenTomatoes);
            }
        };

        // add Metacritic rating
        var addMetacriticRating = function (rating) {
            // Metacritic logo
            var Metacritic_logo = document.createElement("img");
            Metacritic_logo.classList.add("Metacritic", "logo");
            Metacritic_logo.src = "https://upload.wikimedia.org/wikipedia/commons/2/20/Metacritic.svg";

            // Metacritic icon
            var Metacritic_icon = document.createElement("div");
            Metacritic_icon.classList.add("icon");
            Metacritic_icon.appendChild(Metacritic_logo);

            // Metacritic rating
            var Metacritic_rating = document.createElement("div");
            Metacritic_rating.classList.add("rating");
            Metacritic_rating.innerHTML = rating;

            // Metacritic bar
            var Metacritic_bar = document.createElement("div");
            Metacritic_bar.classList.add("bar");
            Metacritic_bar.style.height = "6px";
            Metacritic_bar.style.width = rating + "%";
            if (rating < 40) {
                Metacritic_bar.style.backgroundColor = "#FF0000";
            }
            if (rating >= 40 && rating <= 60) {
                Metacritic_bar.style.backgroundColor = "#FFCC33";
            } else if (rating > 60) {
                Metacritic_bar.style.backgroundColor = "#66CC33";
            }

            // Metacritic votes
            var Metacritic_votes = document.createElement("div");
            Metacritic_votes.classList.add("votes");
            Metacritic_votes.style.marginTop = "4px";
            Metacritic_votes.style.height = "6px";
            Metacritic_votes.style.width = "100%";
            Metacritic_votes.style.backgroundColor = "rgba(0, 0, 0, .50)";
            Metacritic_votes.appendChild(Metacritic_bar);

            // Metacritic number
            var Metacritic_number = document.createElement("div");
            Metacritic_number.classList.add("number");
            Metacritic_number.appendChild(Metacritic_rating);
            Metacritic_number.appendChild(Metacritic_votes);

            // Metacritic rated-text
            var Metacritic_rated_text = document.createElement("div");
            Metacritic_rated_text.classList.add("rated-text");
            Metacritic_rated_text.appendChild(Metacritic_icon);
            Metacritic_rated_text.appendChild(Metacritic_number);

            // Metacritic rating
            var Metacritic = document.createElement("li");
            Metacritic.classList.add("Metacritic-rating");
            Metacritic.appendChild(Metacritic_rated_text);
            Metacritic.style.marginRight = "21px";

            //add Metacritic rating to the page
            var ratings = document.getElementsByClassName("ratings")[0];
            if (ratings) {
                ratings.appendChild(Metacritic);
            }
        };

        // get ratings from omdb
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.omdbapi.com/?apikey=" + apikey + "&i=" + IMDbID,
            onload: function (response) {
                var json = JSON.parse(response.responseText);
                // IMDb
                if (json && json.imdbRating && json.imdbRating !== "N/A" && json.imdbVotes && json.imdbVotes !== "N/A") {
                    console.log("IMDb rating: " + json.imdbRating);
                    console.log("IMDb votes: " + ((json.imdbVotes.replace(/,/g, "")) / 1000).toFixed(1) + "k");

                    addIMDbRating(json.imdbRating, ((json.imdbVotes.replace(/,/g, "")) / 1000).toFixed(1));
                } else {
                    console.log("IMDb rating: not available");
                }
                // Rotten Tomatoes
                if (json && json.Ratings[1] && json.Ratings[1] !== "undefined" && json.Ratings[1].Source == "Rotten Tomatoes" && json.Ratings[1].Value) {
                    console.log("Tomatometer: " + json.Ratings[1].Value);
                    var RottenFresh = 0
                    if (parseFloat(json.Ratings[1].Value) < 60) {
                        RottenFresh = "Rotten";
                    } else {
                        RottenFresh = "Fresh";
                    }
                    console.log("Rotten or Fresh? " + RottenFresh);

                    addRottenTomatoesRating(json.Ratings[1].Value, RottenFresh);
                } else {
                    console.log("Tomatometer: not available");
                }
                // Metacritic
                if (json && json.Metascore && json.Metascore !== "N/A") {
                    console.log("Metascore: " + json.Metascore);

                    addMetacriticRating(json.Metascore);
                } else {
                    console.log("Metascore: not available");
                }
                // error
                if (json && json.Error) {
                    console.log("Error: " + json.Error);
                }
            }
        });
    };
})();
