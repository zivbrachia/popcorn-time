'use strict'

let express = require('express');
let router = express.Router();
let request = require("request");
let fs = require('fs'); // TODO: replace with database

let file_name = "movies.json"; // TODO: move to config.js
let movies = read(file_name);

router.get('/', function (req, res) {
    res.send('API V.1');
});

router.get('/movies', function (req, res) {
    res.json(movies[0]);
});

router.get('/query', function (req, res) {
    let query = [];
    let map = new Map();
    for (let i = 0; i < movies.length; i++) {
        for (let j = 0; j < movies[i].length; j++) {
            if (movies[i][j].year === req.query.year) {
                if (movies[i][j].rating.percentage >= req.query.rating) {
                    query.push(movies[i][j]);
                    map.set(movies[i][j]._id, movies[i][j]);
                }
            }
        }
    }
    res.json(Array.from(map.values()));
    
    
});

router.get('/popcorn/movies', function (req, res) {
    let movies_p = fetch_movies_pages_promise();
    movies_p.then((movies_page_array) => {
        if (movies_page_array.length>0) {
            let promise_array = [];
            for (let i = 0; i < movies_page_array.length; i++) {
                promise_array.push(fetch_movies_per_page_promise(i+1));
            }
            Promise.all(promise_array).then((values) => {
                movies = values;
                res.json("done");
            }).catch((error) => {
                console.log(error);
            });
        }
        
    }).catch((error) => {
        console.log(error);
    });
    /*
    var options = {
        method: 'GET',
        url: 'https://tv-v2.api-fetch.website/movies',
        body: '{}'
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let arr_movie_page = JSON.parse(body);
        for (let i = 0; i < arr_movie_page.length; i++) {
            ///
            let options = {
                method: 'GET',
                url: 'https://tv-v2.api-fetch.website/movies/' + (i + 1),
                qs: { genre: 'All', order: '-1', sort: 'trending' },
                body: '{}'
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                let arr_movies_in_page = JSON.parse(body);
                for (let j = 0; j < arr_movies_in_page.length; j++) {
                    delete arr_movies_in_page[j].synopsis;
                    delete arr_movies_in_page[j].runtime;
                    delete arr_movies_in_page[j].released;
                    delete arr_movies_in_page[j].certification;
                    delete arr_movies_in_page[j].trailer;
                    delete arr_movies_in_page[j].images;

                    movies.push(arr_movies_in_page[j]);
                    //fs.appendFileSync(file_name, JSON.stringify(arr_movies_in_page[j]));
                }
                res.json("done");
            });
        }
    });*/
});

function fetch_movies_pages_promise() {
    var options = {
        method: 'GET',
        url: 'https://tv-v2.api-fetch.website/movies',
        body: '{}'
    };

    let fetch_movies_pages = new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(JSON.parse(body));
        });
    });
    return fetch_movies_pages
}

function fetch_movies_per_page_promise(page) {
    let options = {
        method: 'GET',
        url: 'https://tv-v2.api-fetch.website/movies/' + page,
        qs: { genre: 'All', order: '-1', sort: 'trending' },
        body: '{}'
    };

    let fetch_movies_per_page = new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(JSON.parse(body))
        });
    });
    return fetch_movies_per_page;
}

function write(file_name, data) {
    fs.writeFileSync(file_name, JSON.stringify(data));
    /*fs.writeFile(file_name, data, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('Data written to file');
    });*/
}

function read(file_name) {
    let data = undefined;
    let movies = undefined;
    try {
        data = fs.readFileSync(file_name);
    } catch (err) {
        write(file_name, []);
        data = JSON.stringify([]);
    }
    try {
        movies = JSON.parse(data);
    } catch (err) {
        return [];
    }
    return movies;
    /*fs.readFileSync(file_name, (err, data) => {
        if (err) throw err;
        let movies = JSON.parse(data);
        console.log(movies);
    });*/
}
module.exports = router;
