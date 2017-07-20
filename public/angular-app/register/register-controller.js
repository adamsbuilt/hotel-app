angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController($http) {
  var vm = this;

  vm.register = function() {
    var user = {
      username: vm.username,
      password: vm.password
    };

    if (!vm.username || !vm.password) {
      vm.err = 'Please add a username and password';
    } else {
      if (vm.password !== vm.passwordRepeat) {
        vm.err = 'Please make sure passwords match';
      } else {
        $http.post('/api/users/register', user).then(function(result) {
          console.log(result);
          vm.message = 'Registration Successful!';
          vm.err = '';
        }).catch(function(err) {
          console.log(err);
        });
      }
    }
  }
};
