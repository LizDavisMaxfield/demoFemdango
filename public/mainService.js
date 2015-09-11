    angular.module("femdangoApp").service("mainService", function($http, $q) {

        
        var that = this;
        
        //This function inputs data onto the movie page
        this.getMovie = function(imdbId) {
            console.log("imdbId:", imdbId);
            var dfd = $q.defer()
            $http.get("/bechdel/" + imdbId)
            .then(function(response) {
                dfd.resolve(response.data);

            }, function(error) {
                console.log("error: ", error);
                dfd.reject(error);
            });
            return dfd.promise
        };

//this function needs to use the tmdbId to return the imdbId. 
        this.getMoviePage = function(id) {
            var dfd = $q.defer()
            $http.get("http://api.themoviedb.org/3/movie/" + id + "?api_key=df49ca00f987ca4b363f4e6291e80c15&page=1&append_to_response=trailers&include_video=true")
            .then(function(response) {
                this.getMovie(response.data.imdb_id).then(function(movieData){
//                    console.log("this is movie data:", movieData)
                    dfd.resolve(movieData);
                })
//                dfd.resolve(response.data.imdb_id);    
            }.bind(this), function(error) {
                console.log("error: ", error);
            });
            return dfd.promise
        };        
        
        
        
//This function adds the movies with loadable images to a new array
        function loadMovies(data){
            var promises = [];
            angular.forEach(data, function(item){
               promises.push(loadImage(item)); 
            })
            return $q.allSettled(promises);     
        };
        
//This function checks to see if movie images load
        //***bug sometimes lets broken images through
        function loadImage(movie){
            that.movie = movie;
            var dfd = $q.defer();
            var imageUrl = "https://image.tmdb.org/t/p/w185" + movie.poster_path;
            var image = $(new Image()).prop('src', imageUrl);
            image.on('load', function(){
              dfd.resolve(movie);  
            }).on('error', function(){
                dfd.reject(movie);
            });
            return dfd.promise;
        }
        

        
//This function finds search results that are displayed in slick slider
        this.searchMovies = function(title) {
            var dfd = $q.defer()
            $http.get("http://api.themoviedb.org/3/search/movie?append_to_response=trailers&inclue_video=true&api_key=df49ca00f987ca4b363f4e6291e80c15&query=" + title)
            .then(function(response) {
                 loadMovies(response.data.results)
                    .then(function(results){
                        var loadedMovies = [];
                        angular.forEach(results, function(result){
                            if(result.state === "fulfilled"){
                                loadedMovies.push(result.value);
                            }
                        })
                        dfd.resolve(loadedMovies); 
                     
                    }).catch(function(err){
                        dfd.reject(err);
                    })
        }, function(error) {
            console.log("error: ", error);
        });
        return dfd.promise
    };

//This function displays movies that are currently showing in theaters
        this.searchMoviesInTheaters = function(title) {
            var dfd = $q.defer()
            $http.get("http://api.themoviedb.org/3/movie/now_playing?api_key=df49ca00f987ca4b363f4e6291e80c15&sort_by=popularity.desc&include_adult=false")
            .then(function(response) {
            dfd.resolve(response.data);
        }, function(error) {
            console.log("error: ", error);
        });
        return dfd.promise
    }; 

//This function displays movies that are coming soon to theaters
        this.searchMoviesComingSoon = function(title) {

            function nextweek(){
                var today = new Date();
                var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                return nextweek.toISOString().split('T')[0];   
            };

            function dateInSixMonths(){
                var today = new Date();
                var dateInSixMonths = new Date(today.getFullYear(), today.getMonth()+6, today.getDate()+7);
                    
                return dateInTwoMonths= dateInSixMonths.toISOString().split('T')[0];
//                        console.log("format:", dateInSixMonths)                
            };    
            var dfd = $q.defer()
            $http.get("http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&primary_release_date.gte=" + nextweek() + "&primary_release_date.lte=" + dateInSixMonths() +"&api_key=df49ca00f987ca4b363f4e6291e80c15&include_adult=false")
            .then(function(response) {
            dfd.resolve(response.data);
            }, function(error) {
                console.log("error: ", error);
            });
            return dfd.promise
        }; 
  
        
//This function displays the most popular movies
        this.searchMoviesPopular = function(title) {
            var dfd = $q.defer()
            $http.get("http://api.themoviedb.org/3/discover/movie?vote_average.gte=7&api_key=df49ca00f987ca4b363f4e6291e80c15&sort_by=popularity.desc&include_adult=false")
            .then(function(response) {
            dfd.resolve(response.data);
        }, function(error) {
            console.log("error: ", error);
        });
        return dfd.promise
    }; 


    })