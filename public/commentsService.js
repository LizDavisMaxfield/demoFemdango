

var app = angular.module("femdangoApp").service("commentsService", function($location, $firebaseObject, $firebaseArray, $route){
    var that = this;
    
    this.currentMovieId = $route.current.params.id;
      console.log($route.current.params.name);      
    
    var url = "https://femdango.firebaseio.com";
    var commentsRef = new Firebase(url + "/comments");

    this.comments = $firebaseArray(commentsRef);
    
    this.comments.$loaded().then(function (comments) {
        console.log(comments);
    });
    
    this.badges = {
            bechdel: false,
            mako: false,
            executive: false,
            ratio: false,
            lgbt: false,
            diversity: false,
            disabilities: false
                        
        }
  
   //This function counts how many badges reviewed movies earn 
this.getbadgeCount = function (){
    this.comments.$loaded().then(function (comments) {
//        console.log(comments);
    var earnedBadgeMovies = {};
    for (var i = 0; i < comments.length; i ++) {
//        console.log(comments[i].badges);
        for (badge in comments[i].badges) {
            if (comments[i].badges[badge] === true) {
//                console.log(comments[i].badges[badge]);
                var movieId = comments[i].movieId;
//                console.log(movieId);
                if (earnedBadgeMovies[movieId]) {
                    var thing = earnedBadgeMovies[movieId][badge];
                    earnedBadgeMovies[movieId][badge] = thing ? ++thing : 1;
                }
                else {
                    earnedBadgeMovies[movieId] = {};
                    earnedBadgeMovies[movieId][badge] = 1;
                }
            };
        };
    };    
//        console.log("earned badges", earnedBadgeMovies);
        that.earnedBadgeMovies = earnedBadgeMovies;
});
           
};
this.getbadgeCount();
    
    
    
 
    
});