angular.module('starter.controllers', ['starter.utils'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  //.controller('PlaylistsCtrl', function ($scope) {
  //  $scope.playlists = [
  //    {title: 'Сталкер', id: 1},
  //    {title: 'Монрепо', id: 2}
  //    //{ title: 'Dubstep', id: 3 },
  //    //{ title: 'Indie', id: 4 },
  //    //{ title: 'Rap', id: 5 },
  //    //{ title: 'Cowbell', id: 6 }
  //  ];
  //})

  .controller('AreaListCtrl', function ($scope, $stateParams) {
    console.log("$stateParams[" + JSON.stringify($stateParams) + "]");
    var areas = JSON.parse(localStorage.getItem("areas"));

    var topos = [];

    for (var i = 0; i < areas.length; i++) {
      if (areas[i].name === $stateParams.area) {
        topos = areas[i].topos;
      }
    }

    $scope.topos = topos;

  })

  .controller("FileController", function ($scope, $ionicLoading) {

    $scope.download = function () {
      $ionicLoading.show({
        template: 'Loading...'
      });
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          fs.root.getDirectory(
            "ExampleProject",
            {
              create: true
            },
            function (dirEntry) {
              dirEntry.getFile(
                "test.png",
                {
                  create: true,
                  exclusive: false
                },
                function gotFileEntry(fe) {
                  var p = fe.toURL();
                  fe.remove();
                  ft = new FileTransfer();
                  ft.download(
                    encodeURI("http://ionicframework.com/img/ionic-logo-blog.png"),
                    p,
                    function (entry) {
                      $ionicLoading.hide();
                      $scope.imgFile = entry.toURL();
                    },
                    function (error) {
                      $ionicLoading.hide();
                      alert("Download Error Source -> " + error.source);
                    },
                    false,
                    null
                  );
                },
                function () {
                  $ionicLoading.hide();
                  console.log("Get file failed");
                }
              );
            }
          );
        },
        function () {
          $ionicLoading.hide();
          console.log("Request for filesystem failed");
        });
    }

    $scope.load = function () {

      $ionicLoading.show({
        template: 'Loading...'
      });
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          fs.root.getDirectory(
            "ExampleProject",
            {
              create: false
            },
            function (dirEntry) {
              dirEntry.getFile(
                "test.png",
                {
                  create: false,
                  exclusive: false
                },
                function gotFileEntry(fe) {
                  console.log("file found")
                  $ionicLoading.hide();
                  $scope.imgFile = fe.toURL();
                },
                function (error) {
                  $ionicLoading.hide();
                  console.log("Error getting file");
                }
              );
            }
          );
        },
        function () {
          $ionicLoading.hide();
          console.log("Error requesting filesystem");
        });

    }

  })

  .controller("AreaListsCtrl", function ($scope, $http, $window, $areaInit) {
    console.log("1>>");
    $areaInit.initArea($http, $window);
    console.log("2>>");

    var areas = JSON.parse(localStorage.getItem("areas"));
    console.log(areas.length);
    var areaNames = [];
    for (var i = 0; i < areas.length; i++) {
      console.log(areas[i].name);
      areaNames.push(areas[i].name);
    }
    ;

    $scope.areas = areaNames;
  });
