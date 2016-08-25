// Ionic Starter App
var dependencies = ['ionic',
					'angular-jwt',
					'monospaced.qrcode',
					'btford.socket-io',
					'ngCordova',
					'yiyangbao.services',
					'yiyangbao.directives',
					'yiyangbao.filters',
					'yiyangbao.controllers',
					'yiyangbao.controllers.user',
					];
var myAppVersion = '0.0.1';
if (!navigator.connection) {
  var Connection = {
	NONE: false
  };
}
var app = angular.module('yiyangbao', dependencies);

app
.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider', '$provide', 'CONFIG', function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $provide, CONFIG) {
    var ACL = function () {
        /*
        * Method to build a distinct bit mask for each role
        * It starts off with "1" and shifts the bit to the left for each element in the
        * roles array parameter
        */
        function buildRoles (roles) {
            var bitMask = "01";
            var userRoles = {};
            for (var role in roles) {
                var intCode = parseInt(bitMask, 2);
                userRoles[roles[role]] = {
                    bitMask: intCode,
                    title: roles[role]
                };
                bitMask = (intCode << 1 ).toString(2);
            }
            return userRoles;
        }
        /*
        * This method builds access level bit masks based on the accessLevelDeclaration parameter which must
        * contain an array for each access level containing the allowed user roles.
        */
        function buildAccessLevels (accessLevelDeclarations, userRoles) {
            var accessLevels = {}, resultBitMask;
            for (var level in accessLevelDeclarations) {
                if (typeof accessLevelDeclarations[level] == 'string') {
                    if (accessLevelDeclarations[level] == '*') {
                        resultBitMask = '';
                        for (var r in userRoles) {
                            resultBitMask += "1";
                        }
                        accessLevels[level] = {
                            bitMask: parseInt(resultBitMask, 2)
                        };
                    }
                    else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'");
                }
                else {
                    resultBitMask = 0;
                    for (var role in accessLevelDeclarations[level]) {
                        if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                        else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'");
                    }
                    accessLevels[level] = {
                        bitMask: resultBitMask
                    };
                }
            }
            return accessLevels;
        }
        var userRoles = buildRoles(CONFIG.userRoles);
        var accessLevels = buildAccessLevels(CONFIG.accessLevels, userRoles);
        return {
            userRoles: userRoles,
            accessLevels: accessLevels
        };
    };
    var acl = ACL();
    var access = acl.accessLevels;
    $provide.service('ACL', function () { 
        return acl;
    });
    $urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
        .state('intro', {
            url:'/intro',
            templateUrl: 'partials/about/intro.html',
            controller: 'intro',
            data: {
                access: access.public
            }
        });
    $stateProvider
        .state('public', {
            abstract: true,
            templateUrl: 'partials/sideMenuLeft.html',
            controller: 'publicSideMenu',
            data: {
                access: access.public
            }
        })
        .state('public.aboutUs', {
            url: '/aboutUs',
            templateUrl: 'partials/about/aboutUs.html',
            data: {
                menuToggle: true
            },
            controller: 'aboutUs'
        })
        .state('public.agreement', {
            url: '/agreement',
            templateUrl: 'partials/about/agreement.html',
            data: {
                menuToggle: true
            },
            controller: 'agreement'
        })
        .state('public.settings', {
            url: '/settings',
            templateUrl: 'partials/about/settings.html',
            data: {
                menuToggle: true
            },
            controller: 'settings'
        })
        .state('public.feedback', {
            url: '/feedback',
            templateUrl: 'partials/about/feedback.html',
            controller: 'feedback'
        });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl',
        data: {
            access: access.public
        }
    });

    $stateProvider
        .state('user', {
            abstract: true,
            url: '/user',
            templateUrl: 'partials/user/tabsBottom.html',
            controller: 'userTabsBottom',
            data: { 
                access: access.user
            }
        })
        .state('user.home', {
            url: '/home',
            data: {
                menuToggle: true
            },
            views: {
                'userHome': {
                    templateUrl: 'partials/user/home.html',
                    controller: 'userHome'
                }
            }
        })
        .state('user.bespeak', {
            url: '/bespeak',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/bespeak.html',
                    controller: 'userBespeakCtrl'
                }
            }
        })
        .state('user.espush', {
            url: '/espush',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/espush.html',
                    controller: 'espushCtrl'
                }
            }
        })
        .state('user.espushitem', {
            url: '/espushitem',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/espushitem.html',
                    controller: 'espushItemCtrl'
                }
            },
            params: {
              id: null,
              issuepolNo: null
            }
        })
        .state('user.claiming', {
            url: '/claiming',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claiming.html',
                    controller: 'userClaimingCtrl'
                }
            }
        })
        .state('user.claimingupload', {
            url: '/claimingupload',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimingupload.html',
                    controller: 'userClaimingUploadCtrl'
                }
            },
            params: {lp: null}
        })
        .state('user.myclaim', {
            url: '/myclaim',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/myclaim.html',
                    controller: 'userMyclaimCtrl'
                }
            }
        })
        .state('user.claimschedule', {
            url: '/claimschedule',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimschedule.html',
                    controller: 'userClaimScheduleCtrl'
                }
            }
        })
        .state('user.myclaimitem', {
            url: '/myclaimitem',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/myclaimitem.html',
                    controller: 'userMyclaimItemCtrl'
                }
            },
            params: {claimNo: null}
        })
        .state('user.claimnotice', {
            url: '/claimnotice',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimnotice.html',
                    controller: 'userClaimNoticeCtrl'
                }
            }
        })
        .state('user.claimdeclare', {
            url: '/claimdeclare',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimdeclare.html',
                }
            }
        })
        .state('user.claimscope', {
            url: '/claimscope',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimscope.html',
                }
            }
        })
        .state('user.claimdatum', {
            url: '/claimdatum',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimdatum.html',
                }
            }
        })
        .state('user.claimexplain', {
            url: '/claimexplain',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimexplain.html',
                }
            }
        })

        .state('user.claimfraud', {
            url: '/claimfraud',
            data:{
                menuToggle: true
            },
            views:{
                'userHome':{
                    templateUrl:'partials/user/claimfraud.html',
                }
            }
        })

        .state('user.settings', {
            url: '/settings',
            views: {
                'userHome': {
                    templateUrl: 'partials/user/settings.html',
                    controller: 'userSettings'
                }
            }
        })
        .state('user.feedback', {
            url: '/feedback',
            views: {
                'userHome': {
                    templateUrl: 'partials/user/feedback.html',
                    controller: 'userFeedback'
                }
            }
        })
        .state('user.mine', {
            url: '/mine',
            views: {
                'userMine': {
                    templateUrl: 'partials/user/mine.html',
                    controller: 'userMineCtrl'
                }
            }
        })
        
        ;
}])

//配置微信图片白名单
.config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|weixin|wxlocalresource):/);
    //其中 weixin 是微信安卓版的 localId 的形式，wxlocalresource 是 iOS 版本的 localId 形式
}])

.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(10); 
  $ionicConfigProvider.views.forwardCache(true);
  $ionicConfigProvider.backButton.icon('ion-ios7-arrow-back');
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.previousTitleText(false); 
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
}])
.config(['$httpProvider', 'jwtInterceptorProvider', function ($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = ['config', 'jwtHelper', '$http', 'CONFIG', 'Storage', function(config, jwtHelper, $http, CONFIG, Storage) {
        var token = Storage.get('token');
        var refreshToken = Storage.get('refreshToken');
        if (!token && !refreshToken) {
            return null;
        }
        var isExpired = true;
        try {
            isExpired = jwtHelper.isTokenExpired(token);
        }
        catch (e) {
            isExpired = true;
        }
        if (config.url.substr(config.url.length - 5) === '.html' || config.url.substr(config.url.length - 3) === '.js' || config.url.substr(config.url.length - 4) === '.css' || config.url.substr(config.url.length - 4) === '.jpg' || config.url.substr(config.url.length - 4) === '.png' || config.url.substr(config.url.length - 4) === '.ico' || config.url.substr(config.url.length - 5) === '.woff') { 
            return null;
        }
        else if (isExpired) {   
            if (refreshToken && refreshToken.length >= 16) { 
                return $http({
                    url: CONFIG.baseUrl + 'refreshToken',
                    skipAuthorization: true,
                    method: 'POST',
                    timeout: 5000,
                    data: { 
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken 
                    }
                }).then(function (res) {
                    Storage.set('token', res.data.token);
                    Storage.set('refreshToken', res.data.refreshToken);
                    return res.data.token;
                }, function (err) {
                    console.log(err);
                    return null;
                });
            }
            else {
                Storage.rm('refreshToken'); 
                return null;
            }  
        } 
        else {
            return token;
        }
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
}])

.run(['$ionicPlatform', '$rootScope', '$state', 'Storage', 'Token', '$ionicPopup', function ($ionicPlatform, $rootScope, $state, Storage, Token, $ionicPopup) {
  $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (navigator.connection) {
            $rootScope.myOnline = navigator.connection.type;
        }
        else {
            $rootScope.myOnline = window.navigator.onLine;
        }
        $ionicPlatform.on('online', function () { 
            if (navigator.connection) {
                $rootScope.myOnline = navigator.connection.type;
            }
            else {
                $rootScope.myOnline = window.navigator.onLine;
            }
            $rootScope.$broadcast('onOnline');
        }, false);
        $ionicPlatform.on('offline', function () {
            if (navigator.connection) {
                $rootScope.myOnline = navigator.connection.type;
            }
            else {
                $rootScope.myOnline = window.navigator.onLine;
            }
            $rootScope.$broadcast('onOffline');
        }, false);
        
        

        switch (Token.curUserRole()) {
            case 'public':
                // $state.go('public.aboutUs');
                $state.go('login');
                break;
            case 'user':
                $state.go('user.home');
                // $state.go('user.myclaimitem');
                break;
            case 'serv':
                $state.go('serv.home');
                break;
            case 'medi':
                $state.go('medi.home');
                break;
            default:
                // $state.go('public.aboutUs');
                $state.go('login');
        }
    });
}])


;