'use strict';
angular.module("myApp.auth", ["firebase"]).
    controller("AuthCtrl", ["$scope", "$firebaseAuth",
        function($scope, $firebaseAuth) {
            var ref = new Firebase("https://brilliant-fire-4886.firebaseio.com");
            $scope.authObj = $firebaseAuth(ref);
            $scope.authData = undefined;
            $scope.errorMessage = "";


            $scope.authWithPassword = function(email, password){
                $scope.authObj.$authWithPassword({
                    email: email,
                    password: password
                }).then(function(authData) {
                    $scope.authData = authData;
                    $scope.errorMessage = "";
                    console.log("Logged in as:", authData.uid);
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    console.error("Authentication failed:", error);
                });

            };

            $scope.isAuthentificated = function(){
                return !_.isNull($scope.authObj.$getAuth());
            };
            $scope.signOut = function(){
                $scope.authObj.$unauth();
                $scope.authData = undefined;
            };


            $scope.authWithPassword('test@test.com', 'test');


        }
    ]);

