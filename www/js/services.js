angular.module('yiyangbao.services', ['ngResource'])
.constant('CONFIG', {
  baseUrl: 'http://web.go5le.net/',
  // baseUrl: '/',
  ioDefaultNamespace: 'web.go5le.net/default',
  // ioDefaultNamespace: 'localhost/default',
  consReceiptUploadPath: 'cons/receiptUpload',
  userResUploadPath: 'user/resUpload',
  skApiResUploadPath: 'skApi/resourcesUpload',
  cameraOptions: { 
    quality: 20,
    destinationType: 1, 
    sourceType: 1, 
    encodingType: 0, 
    targetHeight: 1600,
    targetWidth: 1600,
    correctOrientation: true,
    saveToPhotoAlbum: true,
    cameraDirection: 0 
  },
  uploadOptions: {
    fileExt: '.jpg', 
    httpMethod: 'POST', 
    mimeType: 'image/jpg', 
  },
  showTime: 500,
	/* List all the roles you wish to use in the app
	* You have a max of 31 before the bit shift pushes the accompanying integer out of
	* the memory footprint for an integer
	*/
	userRoles: [
		'public',
    'user',
    'serv',
    'unit',
    'medi',
    'ince',
    'admin',
    'super'
	],
	/* Build out all the access levels you want referencing the roles listed above
	* You can use the "*" symbol to represent access to all roles.
	* The left-hand side specifies the name of the access level, and the right-hand side
	* specifies what user roles have access to that access level. E.g. users with user role
	* 'user' and 'admin' have access to the access level 'user'.
	*/
	accessLevels: {
		'public': "*",
    'anon': ['public'],
    'user': ['user', 'admin', 'super'],
    'serv': ['serv', 'super'],
    'unit': ['unit', 'super'],
    'medi': ['medi', 'super'],
    'ince': ['ince', 'super'],
    'admin': ['admin', 'super']
	},
  genders: [1, 2],
  q1: ['父亲名字',
    '母亲名字',
    '配偶名字',
    '小孩名字',
    '父亲生日',
    '母亲生日',
    '配偶生日',
    '小孩生日'],
  q2: ['最喜欢的颜色',
    '小学名称',
    '初中名称',
    '高中名称',
    '大学的专业',
    '最喜欢的演员'],
  q3: ['最喜欢的歌曲',
    '第一只宠物的名字',
    '最喜欢的水果',
    '最喜欢的食物',
    '最喜欢的宠物'],
  serv400: {number: '4008006666', caption: '4008-006-666'},
  uploadImgConfig : {
    '7601121': {
      id: '7601121',
      title: '理赔申请书',
      isMore: true,
      description: '请上传理赔申请书资料'
    },
    '7612161': {
      id: '7612161',
      title: '身份证（正反面）',
      isMore: true,
      description: '请上传身份证的（正反面）'
    },
    '7613161': {
      id: '7613161',
      title: '住院病历、出院小结',
      isMore: true,
      description: '住院病历、出院小结（包括门诊病历的首页个人信息）'
    },
    '7614161': {
      id: '7614161',
      title: '门诊病历',
      isMore: true,
      description: '门诊病历（包括病历首页的个人信息）'
    },
    '7615161': {
      id: '7615161',
      title: '医疗费数据原件',
      isMore: true,
      description: '医疗费数据原件即明细清单'
    },
    '7616161': {
      id: '7616161',
      title: '受益人银行卡或存折',
      isMore: true,
      description: '受益人银行卡或存折（受益人是指被保险人本人）'
    }
  }
})

.factory('Storage', ['$window', function ($window) {
	return {
    set: function(key, value) {
    	$window.localStorage.setItem(key, value);
    },
    get: function(key) {
    	return $window.localStorage.getItem(key);
    },
    rm: function(key) {
    	$window.localStorage.removeItem(key);
    },
    clear: function() {
    	$window.localStorage.clear();
    }
	};
}])
.factory('Token', ['Storage', 'jwtHelper', 'ACL', function (Storage, jwtHelper, ACL) {
  return {
    curUserRole: function () {
      var userRole = ACL.userRoles.public.title;
      try {
        userRole = jwtHelper.decodeToken(Storage.get('token')).userRole;
      }
      catch (e) {
        return ACL.userRoles.public.title;
      }
      return userRole;
    },
    curUserMobile: function() {
      var userMobile = '';
      try {
        userMobile = jwtHelper.decodeToken(Storage.get('yyToken')).mobile;
      } catch(e) {
        return '';
      }
      return userMobile;
    },
    curUserCardID: function() {
      var userCardID = '';
      try {
        userCardID = jwtHelper.decodeToken(Storage.get('yyToken')).cardId;
      } catch(e) {
        return '';
      }
      return userCardID;
    },
    isExpired: function () {
      var isExpired = true;
      try {
        isExpired = jwtHelper.isTokenExpired(Storage.get('token'));
      }
      catch (e) {
        return true;
      }
      return isExpired;
    }
  };
}])


.factory('Data', ['$resource', '$q', 'CONFIG', '$interval', function($resource, $q, CONFIG, $interval){
  var self = this;
  var abort = $q.defer();
  var User = function () {
    return $resource(CONFIG.baseUrl + ':path/:route', {
      path:'user',
    }, {
      verifyPwd: {method:'POST', params:{route: 'verifyPwd'}, timeout: 10000},
      verifyUser: {method:'POST', params:{route: 'verifyUser'}, timeout: 10000},
      login: {method:'POST', params:{route: 'login'}, timeout: 10000},
      getList: {method:'POST', params:{route: 'getList'}, timeout: abort.promise},
      getInfo: {method:'GET', params:{route: 'getInfo'}, timeout: 10000},
      getAccInfo: {method:'GET', params:{route: 'getAccInfo'}, timeout: 10000},
      updateOne: {method:'POST', params:{route: 'updateOne'}, timeout: 10000},
      updateTkn: {method:'POST', params:{route: 'updateTkn'}, timeout: 10000},
      bindBarcode: {method:'POST', params:{route: 'bindBarcode'}, timeout: 10000},
      updateOnesPwd: {method:'POST', params:{route: 'updateOnesPwd'}, timeout: 10000},
      updateOneWithSMS: {method:'POST', params:{route: 'updateOneWithSMS'}, timeout: 10000},
      logout: {method:'GET', params:{route: 'logout'}, timeout: 10000}
    });
  };

  var Claim = function() {
    return $resource(CONFIG.baseUrl + ':path/:route', {
      path: 'skApi',
    }, {
      relation: {method: 'GET', params:{route: 'relation'}, timeout: 10000},
      addClaim: {method: 'POST', params:{route: 'addClaim'}, timeout: 10000},
      getClaimInfo: {method: 'GET', params:{route: 'getClaimInfo'}, timeout: 10000},
      getClaims: {method: 'POST', params:{route: 'getClaims'}, timeout: 10000},
      getMessageCount: {method: 'GET', params:{route: 'getMessageCount'}, timeout: 10000},
      getInProgressCount: {method: 'GET', params:{route: 'getInProgressCount'}, timeout: 10000},
      selfAddClaiming: {method: 'POST', params:{route: 'selfAddClaiming'}, timeout: 10000},
      addClaimEspush: {method: 'POST', params:{route: 'addEspush'}, timeout: 10000},
      getESPush: {method: 'POST', params:{route: 'getESPushs'}, timeout: 10000},
      getClaimSchedule: {method: 'POST', params:{route: 'getClaimSchedule'}, timeout: 10000},
    });
  };

  var Interface = function () {
    return $resource(CONFIG.baseUrl + ':path/:route', {
      // path:'interface'
    }, {
      jsSdkConfig: {method:'GET', params:{path: 'wx', route:'jsSdkConfig'}, timeout: 30000},
      jsSdkReqMedia: {method:'POST', params:{path: 'wx', route:'jsSdkReqMedia'}, timeout: 30000}
    });
  };



  self.User = User();
  self.Claim = Claim();
  self.Interface = Interface();

  return self;
}])

.factory('User', ['$rootScope', 'PageFunc', '$ionicLoading', '$ionicActionSheet', '$cordovaCamera', '$cordovaFileTransfer', 'CONFIG', '$timeout', 'Storage', 'Data', 'Token', '$state', '$ionicHistory', '$ionicModal', '$q', '$ionicSlideBoxDelegate', 'jwtHelper', '$http', '$interval', function ($rootScope, PageFunc, $ionicLoading, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, CONFIG, $timeout, Storage, Data, Token, $state, $ionicHistory, $ionicModal, $q, $ionicSlideBoxDelegate, jwtHelper, $http, $interval) {
  var self = this;
  self.verifyPwd = function (pwd) {
    var deferred = $q.defer();
    Data.User.verifyPwd({password: pwd}, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.verifyUser = function (user, pwdQst) {
    var deferred = $q.defer();
    Data.User.verifyUser({user: user, pwdQst: pwdQst}, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.login = function ($scope) {
    $ionicLoading.show({
      template: '<ion-spinner style="height:2em;width:2em"></ion-spinner>'
    });
    Data.User.login($scope.login, function (data, headers) {
      $scope.error.loginError = '';
      $ionicLoading.hide();
      var userRole = jwtHelper.decodeToken(data.results.token).userRole;
      Storage.set('token', data.results.token);
      Storage.set('yyToken', data.results.yyToken);
      if ($scope.login.rememberme) {
        Storage.set('refreshToken', data.results.refreshToken);
      }
      else {
        Storage.rm('refreshToken');
      }
      if (data.results.justActivated) {
        self.bindMobileModal(userRole, '-initBind'); 
      }
      if ($scope.loginModal) {
        $scope.loginModal.remove()
        .then(function () {
          $scope.loginModal = null;
        });
      }
      if ($scope.registerModal) {
        $scope.registerModal.remove()
        .then(function () {
          $scope.registerModal = null;
        });
      }
      if ($scope.pwdResetModal) {
        $scope.pwdResetModal.remove()
        .then(function () {
          $scope.pwdResetModal = null;
        });
      }
      var toStateName = (userRole === 'medi' && 'medi.home') || (userRole === 'serv' && 'serv.home') || (userRole === 'user' && 'user.home') || 'public.aboutUs';
      $state.go($scope.state.toStateName || toStateName);
    }, function (err) {
      var myAppVersionLocal = Storage.get('myAppVersion') || '';
      Storage.clear();
      if (myAppVersionLocal) Storage.set('myAppVersion', myAppVersionLocal);
      $ionicLoading.hide();
      $scope.error.loginError = err.data || '连接超时!';
    });
  };
  self.getInfo = function (token, options, fields) { 
    var deferred = $q.defer();
    Data.User.getInfo({token: token}, function (data, headers) { 
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.getAccInfo = function (token, options, fields) { 
    var deferred = $q.defer();
    Data.User.getAccInfo({token: token}, function (data, headers) { 
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.bindBarcode = function (barcode) {
    var deferred = $q.defer();
    Data.User.bindBarcode(barcode, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.updateOne = function (user, options) {
    var deferred = $q.defer();
    Data.User.updateOne({user: user, options: options}, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.updateTkn = function (params) {
    var deferred = $q.defer();
    console.log(params);
    Data.User.updateTkn(params, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.updateOneWithSMS = function (user, options) {
    var deferred = $q.defer();
    Data.User.updateOneWithSMS(user, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.updateOnesPwd = function (user, options) {
    var deferred = $q.defer();
    Data.User.updateOnesPwd(user, function (data, headers) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.logout = function ($scope) {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b class="assertive">确认退出</b>' }
      ],
      titleText: '确认退出账号吗?',
      cancelText: '取消',
      cancel: function() {
      },
      buttonClicked: function(index) {
        if (index === 0) {
          var refreshToken = Storage.get('refreshToken') && {refreshToken: Storage.get('refreshToken')} || {}; 
          Data.User.logout(refreshToken, function (data, headers) {
          }, function (err) {
          });
          var myAppVersionLocal = Storage.get('myAppVersion') || '';
          Storage.clear();
          if (myAppVersionLocal) Storage.set('myAppVersion', myAppVersionLocal);
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          // $state.go('public.aboutUs');
          $state.go('login');
        }
      }
    });
  };
  self.loginModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.loginModal = modal;
      $scope.loginModal.show();
      self.pwdResetModal($scope); 
    });
    $scope.actions = $scope.actions || {};
    $scope.error = $scope.error || {};
    $scope.actions.closeLogin = function () {
      $scope.loginModal.hide();
    };
    $scope.actions.showLogin = function () {
      $scope.loginModal.show();
    };
    $scope.actions.preRegister = function () {
      $scope.actions.closeLogin();
      $scope.actions.showRegister();
    };
    $scope.actions.prePwdReset = function () {
      $scope.actions.closeLogin();
      $scope.actions.showPwdReset();
    };
    $scope.actions.login = function () {
      self.login($scope);
    };
    $scope.login = {
      username: '',
      password: '',
      rememberme: true
    };
  };
  self.registerModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/register.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.registerModal = modal;
    });
    $scope.actions.closeRegister = function () {
      $scope.registerModal.hide();
    };
    $scope.actions.showRegister = function () {
      $scope.registerModal.show();
    };
    $scope.actions.preLoginR = function () {
      $scope.actions.closeRegister();
      $scope.actions.showLogin();
    };
    $scope.actions.register = function () {
      self.register($scope.register).then(function (data) {
        $scope.error.registerError = '';
        Storage.set('token', data.results.token);
        if ($scope.loginModal) {
          $scope.loginModal.remove()
          .then(function () {
            $scope.loginModal = null;
          });
        }
        if ($scope.pwdResetModal) {
          $scope.pwdResetModal.remove()
          .then(function () {
            $scope.pwdResetModal = null;
          });
        }
        $scope.registerModal.remove()
        .then(function () {
          $scope.registerModal = null;
        });
        $state.go($scope.state.toStateName || 'user.home');
      }, function (err) {
        var myAppVersionLocal = Storage.get('myAppVersion') || '';
        Storage.clear();
        if (myAppVersionLocal) Storage.set('myAppVersion', myAppVersionLocal);
        $scope.error.registerError = err.data;
      });
    };
    $scope.register = {
      username: 'z',
      mobile: '13282037883',
      password: 'a',
      repeatPassword: 'a',
      name: '周天才',
      gender: true,
      rememberme: false
    };
  };
  self.pwdResetModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/pwdReset.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.pwdResetModal = modal;
    });
    $scope.data = {};
    if (!$scope.loginModal && $scope.accountInfo && $scope.accountInfo.user.username) {
      $scope.data.value = $scope.accountInfo.user.username;
    }
    $scope.password = {};
    $scope.config = $scope.config || {};
    $scope.config.serv400 = CONFIG.serv400;
    $scope.currentIndex = 0;
    $scope.error.pwdResetError = '';
    var token;
    $scope.actions.closePwdReset = function () {
      $scope.pwdResetModal.hide();
    };
    $scope.actions.showPwdReset = function () {
      $scope.pwdResetModal.show();
      $timeout(function () { 
        $scope.slidesCount = $ionicSlideBoxDelegate.$getByHandle('pwdReset').slidesCount();
        $ionicSlideBoxDelegate.$getByHandle('pwdReset').enableSlide(false); 
        $ionicSlideBoxDelegate.$getByHandle('pwdReset').update();
      });
    };
    $scope.actions.preLoginP = function () {
      $scope.actions.closePwdReset();
      if ($scope.loginModal) {
        $scope.actions.showLogin();
      }
      else {
        $scope.pwdResetModal.remove()
        .then(function () {
          $scope.pwdResetModal = null;
        });
      }
    };
    $scope.actions.previous = function () {
      $ionicSlideBoxDelegate.$getByHandle('pwdReset').previous();
    };
    $scope.actions.getIndex = function () {
      $scope.currentIndex = $ionicSlideBoxDelegate.$getByHandle('pwdReset').currentIndex();
      $scope.error.pwdResetError = '';
    };
    $scope.actions.verifyUser = function () {
      if (!$scope.data.value) {
        $scope.error.pwdResetError = '请输入正确信息!';
        return;
      }
      self.verifyUser($scope.data.value).then(function (data) {
        $scope.pwdQst = data.results;
        $scope.error.pwdResetError = '';
        $ionicSlideBoxDelegate.$getByHandle('pwdReset').next();
      }, function (err) {
        $scope.error.pwdResetError = err.data;
      });
    };
    $scope.actions.verifyUserSMS = function () {
      var smsType = '-findPwd',
          title = '找回登录密码',
          msg = '请输入手机号',
          mobile;
      if (!$scope.loginModal && $scope.accountInfo && $scope.accountInfo.user.username) {
        smsType = '-findDealPwd';
        title = '找回支付密码';
        mobile = $scope.accountInfo.user.mobile;
      }
      if ($scope.bindMobileModal) {
        $scope.bindMobileModal.show();
      }
      else {
        self.bindMobileModal(Token.curUserRole(), smsType, mobile, title, msg, true);
      }
      $scope.actions.preLoginP();
    };
    $scope.actions.pwdInput = function () {
      if (!$scope.pwdQst[0].a || !$scope.pwdQst[1].a || !$scope.pwdQst[2].a) {
        $scope.error.pwdResetError = '未回答所有密保问题!';
        return;
      }
      self.verifyUser($scope.data.value, $scope.pwdQst).then(function (data) {
        token = data.results;
        $scope.error.pwdResetError = '';
        $ionicSlideBoxDelegate.$getByHandle('pwdReset').next();
      }, function (err) {
        $scope.error.pwdResetError = err.data;
      });
    };
    $scope.actions.pwdReset = function () {
      if (!$scope.password.newPassword || !$scope.password.repeatPwd) {
        $scope.error.pwdResetError = '请输入密码!';
        return;
      }
      if ($scope.password.newPassword !== $scope.password.repeatPwd) {
        $scope.error.pwdResetError = '两次输入不一致!';
        return;
      }
      if (!token) {
        $scope.error.pwdResetError = '认证已过期, 请重新回答问题!';
        return;
      }
      $scope.password.token = token;
      if ($scope.loginModal) {
        $scope.password.targetKey = 'password';
      }
      else {
        $scope.password.targetKey = 'extInfo.yiyangbaoHealInce.dealPassword';
      }
      self.updateOnesPwd($scope.password).then(function () {
        $scope.error.pwdResetError = '';
        $scope.actions.preLoginP();
      }, function (err) {
        $scope.error.pwdResetError = err.data + ', 请重新回答问题!';
      });
    };
  };
  self.passwordModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/password.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.passwordModal = modal;
      $scope.passwordModal.show();
    });
    $scope.actions = $scope.actions || {};
    $scope.error = $scope.error || {};
    $scope.password = {
      targetKey: 'password'
    };
    $scope.actions.closePassword = function () {
      $scope.passwordModal.hide();
    };
    $scope.actions.password = function () {
      self.updateOnesPwd($scope.password).then(function () {
        $scope.error.passwordError = '';
        $scope.passwordModal.remove()
        .then(function () {
          $scope.passwordModal = null;
        });
      }, function (err) {
        $scope.error.passwordError = err.data;
      });
    };
  };
  self.dealPasswordModal = function ($scope, oldDealPwd, closeAble) {
    $scope.closeAble = closeAble; 
    $scope.oldDealPwd = oldDealPwd;
    $ionicModal.fromTemplateUrl('partials/modal/dealPassword.html', {
      scope: $scope,
      backdropClickToClose: false, 
      hardwareBackButtonClose: false, 
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.dealPasswordModal = modal;
      $scope.dealPasswordModal.show();
    });
    if ($scope.oldDealPwd) {
      self.pwdResetModal($scope);
    }
    $scope.actions = $scope.actions || {};
    $scope.error = $scope.error || {};
    $scope.payBill = $scope.payBill || {};
    $scope.dealPassword = {
      seriesNum: $scope.payBill.userSocketId,
      targetKey: 'extInfo.yiyangbaoHealInce.dealPassword'
    };
    $scope.password = {
      targetKey: 'password'
    };
    $scope.actions.closeDealPassword = function () {
      $scope.dealPasswordModal.hide();
    };
    $scope.actions.prePwdReset = function () {
      $scope.dealPasswordModal.remove()
      .then(function () {
        $scope.error.dealPasswordError = '';
        $scope.dealPasswordModal = null;
      });
      $scope.actions.showPwdReset();
    };
    $scope.actions.dealPassword = function () {
      self.updateOnesPwd($scope.dealPassword).then(function (data) {
        $scope.error.dealPasswordError = '';
        $scope.dealPassword = {
          targetKey: 'extInfo.yiyangbaoHealInce.dealPassword'
        };
        $scope.dealPwd = true; 
        if ($scope.actions.check) $scope.actions.check(); 
        if (($scope.dealPassword.loginPwd || $scope.password.oldPassword) && $scope.password.newPassword && $scope.password.repeatPwd) {
          $scope.password.loginPwd = $scope.dealPassword.loginPwd;
          $scope.password.seriesNum = $scope.dealPassword.seriesNum;
          self.updateOnesPwd($scope.password).then(function (data) {
            $scope.error.passwordError = '';
            if ($scope.pwdResetModal) {
              $scope.pwdResetModal.remove()
              .then(function () {
                $scope.pwdResetModal = null;
              });
            }
            $scope.dealPasswordModal.remove()
            .then(function () {
              $scope.dealPasswordModal = null;
            });
          }, function () {
            console.log(err);
            $scope.error.passwordError = err.data;
          });
        }
        else {
          if ($scope.pwdResetModal) {
            $scope.pwdResetModal.remove()
            .then(function () {
              $scope.pwdResetModal = null;
            });
          }
          $scope.dealPasswordModal.remove()
          .then(function () {
            $scope.dealPasswordModal = null;
          });
        }
      }, function (err) {
        console.log(err);
        $scope.error.dealPasswordError = err.data;
      });
    };
  };
  self.updateModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/update.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.updateModal = modal;
    });
    $scope.actions = $scope.actions || {};
    $scope.error = $scope.error || {};
    $scope.actions.cancel = function () {
      $scope.updateModal.hide();
    };
    $scope.actions.show = function (textarea) {
      $scope.error.updateError = '';
      $scope.textarea = textarea;
      $scope.updateModal.show();
    };
    $scope.actions.submit = function () {
      if (!$scope.data.value) {
        $scope.error.updateError = '输入不能为空!';
        return;
      }
      var upData = {};
      upData[$scope.data.key] = $scope.data.value;
      self.updateOne(upData).then(function (data) {
        $scope.error.updateError = '';
        $scope.data = {};
        if ($scope.accountInfo) {
          $scope.accountInfo.user = data.results;
          $scope.accountInfo.user.personalInfo.birthdate = new Date($scope.accountInfo.user.personalInfo.birthdate);
        }
        if ($scope.info) {
          $scope.info = data.results;
          $scope.info.personalInfo.birthdate = new Date($scope.info.personalInfo.birthdate);
        }
        $scope.actions.cancel();
      }, function (err) {
        if (err.data && err.data.name) {
          $scope.error.updateError = '数据库写入错误!';
          return;
        }
        $scope.error.updateError = err.data;
      });
    };
  };
  self.bindMobileModal = function (userRole, smsType, mobile, title, msg, closeAble) { 
    var $scope = $rootScope.$new(); 
    $ionicModal.fromTemplateUrl('partials/modal/bindMobile.html', {
      scope: $scope, 
      animation: 'slide-in-up',
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function (modal) {
      $scope.bindMobileModal = modal;
      $scope.bindMobileModal.show();
    });
    $scope.actions = {};
    $scope.error = {};
    $scope.data = {
      mobile: mobile,
      smsType: smsType
    };
    $scope.config = $scope.config || {};
    $scope.config.title = title || '绑定手机';
    $scope.config.msg = msg || '请输入手机号';
    $scope.config.notCloseAble = closeAble !== true;
    $scope.config.timer = 0;
    $scope.actions.cancel = function () {
      $scope.bindMobileModal.hide();
    };
    $scope.actions.send = function () {
      if (!$scope.data.mobile) {
        $scope.error.bindMobileError = '手机号不能为空!';
        return;
      }
      Data.Interface.smsSend($scope.data, function (data, headers) {
        $scope.error.bindMobileError = '短信已发送, 请查收!';
        $scope.config.timer = data.results.timer;
        $interval(function () {
          $scope.config.timer--;
        }, 1000, data.results.timer);
      }, function (err) {
        $scope.error.bindMobileError = err.data;
      });
    };
    $scope.actions.submit = function () {
      $http.defaults.headers.common['smsAuth'] = $scope.data.verify;
      $http.defaults.headers.common['smsType'] = smsType;
      $http.defaults.headers.common['smsMobile'] = $scope.data.mobile;
      var resAct = 'updateOne';
      if (smsType === '-initBind' && (!$scope.data.mobile || !$scope.data.verify)) {
        $scope.error.bindMobileError = '输入不能为空!';
        return;
      }
      if (smsType === '-chgBind' && (!$scope.data.mobile || !$scope.data.verify || !$scope.data.newMobile)) {
        $scope.error.bindMobileError = '输入不能为空!';
        return;
      }
      if (smsType === '-findPwd' || smsType === '-findDealPwd') {
        if (!$scope.data.mobile || !$scope.data.verify || !$scope.data.newPassword || !$scope.data.repeatPwd) {
          $scope.error.bindMobileError = '输入不能为空!';
          return;
        }
        if ($scope.data.newPassword !== $scope.data.repeatPwd) {
          $scope.error.bindMobileError = '密码不一致!';
          return;
        }
        resAct = 'updateOneWithSMS';
      }
      self[resAct]($scope.data).then(function (data) {
        $scope.error.bindMobileError = '';
        $scope.data = {};
        $scope.bindMobileModal.remove()
        .then(function () {
          $scope.bindMobileModal = null;
          if (userRole === 'user' && closeAble !== true) {
            self.dealPasswordModal($scope);
          }
          else if (closeAble !== true) {
            self.passwordModal($scope);
          }
        });
      }, function (err) {
        if (err.data && err.data.name) {
          $scope.error.bindMobileError = '数据库写入错误!';
          return;
        }
        $scope.error.bindMobileError = err.data;
      });
      delete $http.defaults.headers.common['smsAuth'];
      delete $http.defaults.headers.common['smsType'];
      delete $http.defaults.headers.common['smsMobile'];
    };
  };
  self.pwdQstModal = function ($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/pwdQst.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.pwdQstModal = modal;
      $scope.pwdQstModal.show();
    });
    $scope.actions = $scope.actions || {};
    $scope.error = $scope.error || {};
    $scope.pwdQst = [];
    $scope.actions.closePwdQst = function () {
      $scope.pwdQstModal.hide();
    };
    $scope.actions.pwdQst = function () {
      if (!$scope.pwdQst[0] || !$scope.pwdQst[1] || !$scope.pwdQst[2] || !$scope.pwdQst[0].a || !$scope.pwdQst[1].a || !$scope.pwdQst[2].a) {
        $scope.error.pwdQstError = '输入不能为空!';
        return;
      }
      self.updateOne({'accountInfo.pwdQuestions': $scope.pwdQst}).then(function (data) {
        $scope.error.pwdQstError = '';
        $scope.pwdQstModal.remove()
        .then(function () {
          $scope.pwdQstModal = null;
          $scope.pwdQst = [];
        });
      }, function (err) {
        $scope.error.pwdQstError = err.data;
      });
    };
  };

  self.initAccInfo = function ($scope) {
    $scope.error = {};
    var deferred = $q.defer();
    if (Storage.get('AccInfo')) { 
        $scope.accountInfo = JSON.parse(Storage.get('AccInfo'));
        try {
          if ($scope.accountInfo.user.personalInfo.birthdate) $scope.accountInfo.user.personalInfo.birthdate = new Date($scope.accountInfo.user.personalInfo.birthdate);
        }
        catch (e) {}
    }
    self.getAccInfo().then(function (data) {
        $scope.accountInfo = data.results;
        try {
          if ($scope.accountInfo.user.personalInfo.birthdate) $scope.accountInfo.user.personalInfo.birthdate = new Date($scope.accountInfo.user.personalInfo.birthdate);
        }
        catch (e) {}
        Storage.set('AccInfo', JSON.stringify(data.results));
        deferred.resolve(data.results);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
  };
  self.initInfo = function ($scope) {
    $scope.error = {};
    var deferred = $q.defer();
    if (Storage.get('info')) { 
        $scope.info = JSON.parse(Storage.get('info'));

        $scope.info.idImgThumb = $scope.info.personalInfo.idImg.filter(function (img) {
            if (img) {
                img.urlThumb = img.Url.replace(/\/([^\/]+?\.[^\/]+?)$/, '/thumb/$1'); 
            }
            return true;
        });
          if ($scope.info.personalInfo.birthdate) $scope.info.personalInfo.birthdate = new Date($scope.info.personalInfo.birthdate);
    }
    self.getInfo().then(function (data) {
        $scope.info = data.results; 

        $scope.info.idImgThumb = $scope.info.personalInfo.idImg.filter(function (img) {
            if (img) {
                img.urlThumb = img.Url.replace(/\/([^\/]+?\.[^\/]+?)$/, '/thumb/$1'); 
            }
            return true;
        });
        try {
          if ($scope.info.personalInfo.birthdate) $scope.info.personalInfo.birthdate = new Date($scope.info.personalInfo.birthdate); 
        }
        catch (e) {
        }
        finally {
        }
        Storage.set('info', JSON.stringify(data.results)); 
        deferred.resolve(data.results);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
  };
  return self;
}])

.factory('Claim', ['$q', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicActionSheet', '$cordovaCamera', '$timeout', 'CONFIG', 'PageFunc', 'Data', function($q, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $cordovaCamera, $timeout, CONFIG, PageFunc, Data) {
  var self = this;

  self.claimPicsModal = function($scope) {
    $ionicModal.fromTemplateUrl('partials/modal/claim.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {

      $scope.claimPicsModal = modal;
      $scope.claimPicsModal.show();
      $timeout(function() {
        $scope.slidesCount = $ionicSlideBoxDelegate.$getByHandle('claimPics').slidesCount();
        $ionicSlideBoxDelegate.$getByHandle('claimPics').enableSlide(false); 
        $ionicSlideBoxDelegate.$getByHandle('claimPics').update();
      })
    });

    var cameraOptions = angular.copy(CONFIG.cameraOptions), 
        uploadOptions = angular.copy(CONFIG.uploadOptions),
        wxCameraOptions = ['camera'];

    $scope.actions = $scope.actions || {};
    $scope.imagePages = $scope.imagePages || {};
    $scope.error = $scope.error || {};
    $scope.currentIndex = 0;
    $scope.actions.closeClaimPics = function() {
      $scope.actions.checkSubmitEnabled();
      // $scope.claimPicsModal.hide();
      $scope.actions.rmClaimPics();
    }

    $scope.actions.rmClaimPics = function() {
      $scope.claimPicsModal.remove()
        .then(function() {
          $scope.actions.checkSubmitEnabled();
          $scope.claimPicsModal = null;
        })
    };

    
    $scope.actions.previous = function () {
      $ionicSlideBoxDelegate.$getByHandle('claimPics').previous();
    };

    $scope.actions.next = function () {
      $ionicSlideBoxDelegate.$getByHandle('claimPics').next();
    };


    $scope.actions.getIndex = function() {
      $scope.currentIndex = $ionicSlideBoxDelegate.$getByHandle('claimPics').currentIndex();
      $scope.error.claimPicsError = '';
    }



    $scope.actions.toUpload = function(id, pageNo) {

      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<b>拍摄照片</b>'},
          {text: '相册照片'}
        ],
        titleText: '拍摄' + $scope.uploadImages[id].title,
        cancelText: '取消',
        cancel: function() {

        },
        buttonClicked: function(index) {
          switch(index) {
            case 0:
              cameraOptions.sourceType = 1;
              wxCameraOptions = ['camera'];
              break;
            case 1:
              cameraOptions.sourceType = 2;
              wxCameraOptions = ['album'];
              break;
          }

          if (!(window.navigator && window.navigator.camera)) {
            if (PageFunc.isWeixin()) {
              wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: wxCameraOptions, // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                  // console.log(res);
                  // console.log(res.localIds);
                  $scope.$apply(function () {
                    $scope.imagePages[id] = $scope.imagePages[id] || [];
                    $scope.imagePages[id][ $scope.imagePages[id].length ] = {
                      subType: id,
                      subTitle: $scope.uploadImages[id].title, 
                      ImageUrl: res.localIds[0]
                    };
                    // $scope.imgs = $scope.imgs || [];
                    // for (var i = 0; i < res.localIds.length; i++) {
                    //   $scope.imgs.push({localId: res.localIds[i]});
                    // }
                    // $scope.imgs.push.apply($scope.imgs, res.localIds); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                  });
                }
              });
              return true;
            }
            else {
              return console.log('不支持window.navigator.camera');
            }
          }

          $cordovaCamera.getPicture(cameraOptions).then(function(imageURI) {
            
            $timeout(function() {
              $scope.imagePages[id] = $scope.imagePages[id] || [];
              $scope.imagePages[id][ $scope.imagePages[id].length ] = {
                subType: id,
                subTitle: $scope.uploadImages[id].title, 
                ImageUrl: imageURI
              };

              /*try {
                $cordovaCamera.cleanup().then(function() {
                  console.log('Camera cleanup success.');                  
                }, function(err) {
                  console.log(err);
                })
              } catch(e) {
                console.log(e);
              }*/
            }, 0);

          }, function(err) {
            $scope.error.claimPicsError = err;
            console.log(err);
          });

          return true;
        }
      });
    };

    $scope.actions.toDelete = function(id, index) {
      PageFunc.confirm('您确认要删除此图片吗?' + id + '-' + index,'确认信息').then(function(res) {
        console.log('res', res);
        if ( res === true) {
          // delete $scope.imagePages[id][index];
          // $scope.imagePages[id] = $scope.imagePages[id].slice(index, index);
          $scope.imagePages[id].splice(index, 1);
          if ($scope.imagePages[id].length === 0) {
            delete $scope.imagePages[id];
          }
        }
      });
    }

  };


  self.getClaims = function(query) {
    var deferred = $q.defer();
    Data.Claim.getClaims(query, function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };

  self.getMessageCount = function() {
    var deferred = $q.defer();
    Data.Claim.getMessageCount({},function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  self.getInProgressCount = function() {
    var deferred = $q.defer();
    Data.Claim.getInProgressCount({},function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  self.getClaimInfo = function(query) {
    var deferred = $q.defer();
    Data.Claim.getClaimInfo(query, function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };
  
  self.selfAddClaiming = function(params) {
    var deferred = $q.defer();
    Data.Claim.selfAddClaiming(params, function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };
  
  self.getClaimSchedule = function(query) {
    var deferred = $q.defer();
    Data.Claim.getClaimSchedule(query, function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    })
    return deferred.promise;
  };

  self.getESPush = function() {
    var deferred = $q.defer();
    Data.Claim.getESPush(function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };


  self.getRelation = function() {
    var deferred = $q.defer();
    Data.Claim.relation(function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  self.addClaimEspush = function(params) {
    var deferred = $q.defer();
    Data.Claim.addClaimEspush(params, function(data, headers) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }



  self.addClaim = function(params) {
    var deferred = $q.defer();
    Data.Claim.addClaim(params, function(data, headers){
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  return self;
}])

.factory('PageFunc', ['$ionicPopup', '$ionicLoading', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$ionicModal', '$timeout', function ($ionicPopup, $ionicLoading, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicModal, $timeout) {
  return {
    progress: function(_title, $scope) {
      var progressPopup = $ionicPopup.alert({
        title: _title,
        templateUrl: 'partials/modal/progress.html',
        scope: $scope,
        buttons:[]
      });

      return progressPopup;
    },
    message: function (_msg, _time, _title) {
      var messagePopup = $ionicPopup.alert({
        title: _title || '消息', 
        template: _msg, 
        okText: '确认', 
        okType: 'button-energized' 
      });
      if (_time) {
        $timeout(function () {
          messagePopup.close('Timeout!');
        }, _time);
      }
      return messagePopup;
    },
    confirm: function (_msg, _title) {
      var confirmPopup = $ionicPopup.confirm({
        title: _title,
        template: _msg,
        cancelText: '取消',
        cancelType: 'button-default',
        okText: '确定',
        okType: 'button-energized'
      });
      return confirmPopup;  
    },
    prompt: function (_msg, _title, type) {
      var promptPopup = $ionicPopup.prompt({
        title: _title,
        template: _msg,
        inputType: type || 'password', 
        inputPlaceholder: _msg, 
        cancelText: '取消',
        cancelType: 'button-default',
        okText: '确定',
        okType: 'button-energized'
      });
      return promptPopup;  
    },
    selection: function (_msg, _title, _res, $scope) {
      var selectionPopup = $ionicPopup.show({
        title: _title,
        template: _msg,
        scope: $scope,
        buttons: [{
          text: '取消',
          type: 'button-default',
          onTap: function(e) {
          }
        }, {
          text: '确定',
          type: 'button-positive',
          onTap: function(e) {
            return $scope[_res].selected; 
          }
        }]
      });
      return selectionPopup;  
    },
    viewer: function ($scope, images, $index) {
      $ionicModal.fromTemplateUrl('partials/modal/viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.viewerModal = modal;
        $scope.viewerModal.show();
        $timeout(function () { 
          $scope.currentIndex = $index;
          $scope.slidesCount = $ionicSlideBoxDelegate.$getByHandle('viewer').slidesCount();
        }); 
      });
      $scope.actions = $scope.actions || {};
      $scope.error = $scope.error || {};
      $scope.images = images;
      $scope.zoomMin = 1;
      $scope.zoomMax = 3;
      var tapTimeStamp;
      var exitTimeout;
      var tapInterval = 300;
      $scope.actions.exit = function ($event) {
        if (tapTimeStamp && $event.timeStamp - tapTimeStamp < tapInterval) {
          $timeout.cancel(exitTimeout);
        }
        else {
          tapTimeStamp = $event.timeStamp;
          exitTimeout = $timeout(function () {
            $scope.viewerModal.remove()
            .then(function () {
            });
          }, tapInterval);
        }
      };
      $scope.actions.zoom = function ($index) {
        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + $index).getScrollPosition().zoom;
        if (zoomFactor === $scope.zoomMax) {
          $ionicScrollDelegate.$getByHandle('scrollHandle' + $index).zoomTo(1, true); 
        }
        else {
          $ionicScrollDelegate.$getByHandle('scrollHandle' + $index).zoomBy(2, true); 
        }
      };
      $scope.actions.updateSlideStatus = function($index) {
        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + $index).getScrollPosition().zoom;
        if (zoomFactor === $scope.zoomMin) {
          $ionicSlideBoxDelegate.enableSlide(true);
        } else {
          $ionicSlideBoxDelegate.enableSlide(false);
        }
      };
      $scope.actions.getIndex = function () {
        $scope.currentIndex = $ionicSlideBoxDelegate.$getByHandle('viewer').currentIndex();
      };
    },
    loading: {
      show: function(){
        $ionicLoading.show({
          template: '<ion-spinner style="height:2em;width:2em"></ion-spinner>'
        });
      },
      hide: function(){
        $ionicLoading.hide();
      }
    },
    isWeixin: function () { 
      return (/micromessenger/i).test(navigator.userAgent); 
    }
  };
}])


.factory('Common', [function() {
  var self = this;
  var ZEROS = '0000000000000';

  self.leftZeroPad =  function(val, ml) {      // 字符串左边补齐位数
    if(typeof(val) != 'string') {
      val = String(val);
    }
    return ZEROS.substring(0, ml - val.length) + val;
  };
  
  self.dateRndNo = function(number) {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = self.leftZeroPad(d.getMonth(), 2);
    var dd = self.leftZeroPad(d.getDate(), 2);

    return yyyy + mm + dd + '' + self.getRandomSn(4);
  }

  self.getRandomSn = function(number) {
    return self.leftZeroPad(Math.ceil( Math.random()  * Math.pow(10, number)), number);
  };

  
  return self;
}])

.factory('DateTime', [function() {
  var self = this;

  self.getWorkDate = function(days) {
    var dates = [];
    var currentDate = new Date();
    var gday;
    for(var d = 0; d < 12; d++) {
      
      gday = currentDate.getDay();
      
      if ( gday == 6) {
        currentDate.setTime(currentDate.getTime() + 1 *  24 * 60 * 60 * 1000);
        continue;
      } else if (gday == 0) {
        currentDate.setTime(currentDate.getTime() + 1 *  24 * 60 * 60 * 1000);
        continue;
      }
      dates.push(new Date(currentDate.getTime()));
      if ( dates.length === days) {
        break;
      }
      currentDate.setTime(currentDate.getTime() + 1 *  24 * 60 * 60 * 1000);
    }

    return dates;
  }

  return self;
}])

;