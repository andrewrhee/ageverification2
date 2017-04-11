angular.module('age-verificationApp', [])
  .controller('ageVerificationController', function($scope) {
    $scope.test = 'works!'
    $scope.$watch('info', (data) => console.log(data))
    $scope.verifyUserAge = function(info) {
        console.log(info)
    }
  })
