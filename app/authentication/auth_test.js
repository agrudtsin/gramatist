describe('auth tests', function () {

    beforeEach(function() {
        //module('mock.firebase');
        module('myApp');
    });

    describe('authCtrl', function() {
        var authCtrl, $scope;
        beforeEach(function() {
            //module(function($provide) {
            //    // comes from routes.js in the resolve: {} attribute
            //    $provide.value('user', {uid: 'test123'});
            //});
            inject(function($controller) {
                $scope = {};
                authCtrl = $controller('AuthCtrl', {$scope: $scope});
            });
        });

        it('should define authObj in scope', function() {
            expect($scope.authObj).toBeDefined();
        });

        xit('should auth with test user', function() {

            expect($scope.authData).not.toBeDefined();
            $scope.authWithPassword('test@test.com', 'test');
            expect($scope.authData).toBeDefined();
        });


    });
});
