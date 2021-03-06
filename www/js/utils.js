angular.module('starter.utils', [])

  .factory('$areaInit', ['$window', function ($window) {
    return {
      initArea: function ($http, $window) {
        console.log("$areaInit called");

        if (!localStorage.getItem("areas")) {
          var fileNames = ["monrepo", "stalker","triangular_lake"];
          var areas = [];
          var url = "";
          if (ionic.Platform.isAndroid()) {
            url = "/android_asset/www/";
          }

          for (var i = 0; i < fileNames.length; i++) {
            $http.get(url + 'js/data/json/' + fileNames[i] + '.json').success(function (response) {
              areas.push(response);
              if (areas.length == fileNames.length) {
                console.log("adding to localStorage " + areas.length);
                $window.localStorage.setItem("areas", JSON.stringify(areas));
              }
            }).error(function (data) {
              alert("ERROR");
            });
          }
          console.log("localStorage initialization done!");
        }else{
          console.log("localStorage already initialized!");
        }

        return true;
      }
    }
  }])
  .factory('$drawRoute', ['$window', function ($window) {
    return {
      drawRoute: function (img, lineObject ) {
        console.log("drawRoute line object[" + lineObject+"]");
      }
    }
  }])
;
