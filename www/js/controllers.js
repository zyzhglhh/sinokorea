angular.module('yiyangbao.controllers', [])
.controller('main', ['$scope', function ($scope) {
}])

.controller('publicSideMenu', ['$scope', '$ionicPopup', 'Storage', 'User', function($scope, $ionicPopup, Storage, User){
	$scope.state = {};
        $scope.sideMenu = {
            firstItem: {
                click: function () {
                    if ($scope.loginModal && $scope.actions.showLogin) {
                        $scope.actions.showLogin();
                    }
                    else {
                        User.loginModal($scope);
                    }
                },
                title: '请登录',
                imgSrc: ''
            },
            items: [
                {href: '#/aboutUs', iconClass: 'ion-information-circled', title: '公司简介'},
                {href: '#/agreement', iconClass: 'ion-ios-pricetags', title: '使用协议'},
                {href: '#/settings', iconClass: 'ion-gear-b', title: '系统设置'}
            ]
        };
}])

.controller('aboutUs', ['$scope', function ($scope) {
	
}])

;