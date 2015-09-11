angular.module("femdangoApp").controller("movieCtrl", function($scope, mainService, commentsService, loginService, $location, movie, $firebaseObject, $firebaseArray, $route) {
    
    console.log("movie:", movie);
    console.log("id:", $route.current.params.id) 
    
    $scope.movieData = movie;
                
    
    var url = "https://femdango.firebaseio.com";
    var commentsRef = new Firebase(url + "/comments");
    $scope.comments = $firebaseArray(commentsRef);
    $scope.user = loginService.user;
    var favoritesRef = new Firebase(url + "/users/" + $scope.user.uid + "/favorites");
    var wishListRef = new Firebase(url + "/users/" + $scope.user.uid + "/wishList");
    $scope.userFavoritesList = $firebaseArray(favoritesRef);
    $scope.userWishList = $firebaseArray(wishListRef);
     
//    console.log($scope.userFavoritesList);
    
    $scope.currentMovieId = commentsService.currentMovieId;

    $scope.comments = commentsService.comments;
    $scope.comments.$loaded().then(function (comments) {
            console.log(comments);
        $scope.movieComments = comments;
        }); 
    console.log($scope.comments);
    $scope.badges = commentsService.badges;

    $scope.createComment = function() {
        var date = new Date();
        
        $scope.comments.$add({
            movieId: $route.current.params.id,
            movieTitle: $scope.movieData.title,
            createdAt : date.toLocaleString(),
            userId: $scope.user.uid,
            user : $scope.name,
            text : $scope.userMovieReview,
            badges:  $scope.badges
        }).then(console.log($scope.comments));  
    }
    
    //move to loginService
    $scope.favoriteListManage = function(){
        
        
    var updateFavoritesRef = favoritesRef.child($route.current.params.id);
        console.log($scope.user.favorite);
        if ($scope.user.favorite) {
        updateFavoritesRef.set({
            title: $scope.movieData.title,
            poster: $scope.movieData.posterUrl,
            movieId: $route.current.params.id,
            movieImdbId: $scope.movieData.imdbId,
//          earnedBadges: $scope.movieData.earnedBadges  
        })
        } else {
            console.log($scope.user.favorite);
        var favoritesRemoveRef = new Firebase(url + "/users/" + $scope.user.uid + "/favorites/" + $route.current.params.id);

            favoritesRemoveRef.remove();
        } 
    };
   
    $scope.wishListManage = function(){
    var updateWishListRef = wishListRef.child($route.current.params.id);
        console.log($scope.user.wish);
        if ($scope.user.wish) {
        updateWishListRef.set({
            title: $scope.movieData.title,
            poster: $scope.movieData.posterUrl,
            movieId: $route.current.params.id,
            movieImdbId: $scope.movieData.imdbId,
//          earnedBadges: $scope.movieData.earnedBadges  
        })
        } else {
            console.log($scope.user.wish);
        var wishListRemoveRef = new Firebase(url + "/users/" + $scope.user.uid + "/wishList/" + $route.current.params.id);

            wishListRemoveRef.remove();
        }
    };

    $scope.earnedBadgesArr = commentsService.earnedBadgesArr;

//     $scope.earnedBadgesArr.$loaded().then(function (earnedBadgesArr) {
//            console.log(earnedBadgesArr);
//        }); 
//    $scope.getEarnedBadges = function() {
//        return commentsService.earnedBadgesArr;
//    };
//    console.log($scope.getEarnedBadges());
 
    
    
});