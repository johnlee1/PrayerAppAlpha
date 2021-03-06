 angular.module('prayerApp')

.controller('profileController', function($window, userFactory, postFactory, Auth, $location, $routeParams) {


	var vm = this;
	vm.isConnected = false;
  Auth.getUser().then(function(user){ 
    vm.userId = user.data.id; 
  });

  userFactory.userInfo($routeParams.userId).then(function(user){ // Ray's hack
    vm.profileId = user.data._id; // Ray's hack
    if (user.data.username != $routeParams.userId) { // Ray's hack to redirect to /user/:username
      $window.location.href = '/user/' + user.data.username
    }
    vm.user = user.data;

    callback();
    if (user.photo != null) {
      // get user photo
      // userFactory.getPhoto(vm.profileId).then(function(photo){ 
    //           var imageBlob = new Blob([photo.data], { type: photo.headers('Content-Type') });
      // 	var imageUrl = (window.URL || window.webkitURL).createObjectURL(imageBlob);
      // 	vm.imgSrc = imageUrl; 
      // });
    }
  });

  function callback() {

    // check if connected
    userFactory.isConnected(vm.userId,vm.profileId).then(function(result) {
      vm.isConnected = result.data.isTrue;
    });

    // get posts
    postFactory.getPublicPosts(vm.profileId).then(function(posts){
      vm.posts = posts.data.posts;
    }); 
  };

  vm.followUser = function() {

    var data = {followerId: vm.userId, followedId: vm.profileId};

    userFactory.followUser(data).then(function(data) {
      vm.isConnected = !vm.isConnected;
    });
  };

  vm.unfollowUser = function() {

    var data = {followedId: vm.profileId, followerId: vm.userId};

    userFactory.unfollowUser(data).then(function(data) {
      vm.isConnected = !vm.isConnected;
    });
  };
});
