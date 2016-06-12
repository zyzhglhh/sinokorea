angular.module('yiyangbao.controllers.user', [])
.controller('userTabsBottom', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.newConsNum = 1;
	$scope.actions = {
		clearConsBadge: function () {
			$timeout(function() {
				$scope.newConsNum = 0;
			}, 500);
		}
	};
}])

.controller('userHome', ['$scope', '$q', '$timeout', 'PageFunc', 'Storage', 'User', '$ionicHistory', function($scope, $q, $timeout, PageFunc, Storage, User, $ionicHistory){

	var init = function () {
		var deferred = $q.defer();
		var deferredInfo = $q.defer(), 
			deferredBarcode = $q.defer(); 
		User.initAccInfo($scope).then(function (data) { 
			deferredInfo.resolve(data);
		}, function (err) {
			deferredInfo.reject(err);
		});

		$q.all([deferredInfo.promise]).then(function (data) { 
			
			//console.log($scope.accountInfo.barcode);
			deferred.resolve();
		}, function (errors) {
			console.log(errors);
			deferred.reject();
		});
		return deferred.promise;
	};


	$scope.actions = {        
		doRefresh: function() {
			init()
			.catch(function (err) { 
				console.log(err);
			})
			.finally(function () {
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	$scope.$on('$ionicView.beforeEnter', function () {
		init();
	});

}])


.controller('userBespeakCtrl', ['$scope', function($scope){
	
}])


.controller('userClaimingCtrl', ['$scope', '$state', '$ionicHistory', 'PageFunc', function($scope, $state, $ionicHistory, PageFunc){
	$scope.lp = {
		truename: '吴永松',
		idNo: '330105198205142563',
		mobile: '15888800143',
		accidentDate: new Date('2016-06-11'),
		accidentSite: '浙江省杭州市西湖区',
		isReal: true,
	};
	$scope.config = {
		relationTypes: [
			{id: '00', value: '本人'},
			{id: '01', value: '父母'},
			{id: '02', value: '配偶'},
			{id: '03', value: '子女'},
			{id: '06', value: '其他'},
		]
	}

	$scope.actions = {
		chgRelationType: function() {
			console.log($scope.lp.relationType);
		},
		toContinue: function() {
			var msg = '';
			if (typeof $scope.lp.relationType === 'undefined') {
				msg = '请选择被保险人';
			}

			if ( typeof $scope.lp.truename === 'undefined' || $scope.lp.truename == '') {
				msg += '<br />被保人姓名不能为空';
			}

			if ( typeof $scope.lp.idNo === 'undefined' || $scope.lp.idNo == '') {
				msg += '<br />被保人身份证不能为空';
			}

			if ( typeof $scope.lp.mobile === 'undefined' || $scope.lp.mobile == '') {
				msg += '<br />被保人手机不能为空';
			}

			if ( typeof $scope.lp.accidentDate === 'undefined' || $scope.lp.accidentDate == '') {
				msg += '<br />请选择出险日期';
			}

			if ( typeof $scope.lp.accidentSite === 'undefined' || $scope.lp.accidentSite == '') {
				msg += '<br />出险地点不能为空';
			}

			if ( $scope.lp.isReal !== true) {
				msg += '<br />请您勾选我已确认出险信息属实';
			}

			if ( msg.length > 0) {
				PageFunc.message(msg, 5000, '填写信息');
			} else {
				$state.go('user.claimingupload', {lp: $scope.lp})
			}
			

		}
	}


	$scope.$on("$ionicView.beforeEnter", function(event, data){
		if (! $ionicHistory.forwardView()) {
			PageFunc.message('1、请确认出险属实，故意伪造证明材料属于违法行为，需承担法律责任。<br \>2、我们将以收到您“齐全”的索赔资料作为理赔受理时间;资料不全的我们会以短信方式及时通知您。', null, '自助理赔服务须知').then(function(res) {		
			});
		}
	   
	});
}])

.controller('userClaimingUploadCtrl', ['$scope', '$state', '$stateParams', '$filter', 'PageFunc', function($scope, $state, $stateParams, $filter, PageFunc) {
	$scope.lp = $stateParams.lp;
	var uploadImgConfig = {
		'1': {
			id: '7601121',
			title: '理赔申请书',
			isMore: true,
			description: '请上传理赔申请书资料'
		},
		2: {
			id: '7612161',
			title: '身份证（正反面）',
			isMore: true,
			description: '请上传身份证的（正反面）'
		},
		3: {
			id: '7613161',
			title: '住院病历、出院小结',
			isMore: true,
			description: '住院病历、出院小结（包括门诊病历的首页个人信息）'
		},
		4: {
			id: '7614161',
			title: '门诊病历',
			isMore: true,
			description: '门诊病历（包括病历首页的个人信息）'
		},
		5: {
			id: '7615161',
			title: '医疗费数据原件',
			isMore: true,
			description: '医疗费数据原件即明细清单'
		},
		6: {
			id: '7616161',
			title: '受益人银行卡或存折',
			isMore: true,
			description: '受益人银行卡或存折（受益人是指被保险人本人）'
		}
	};

	$scope.imagePages = {
		'7601121': [
			{ImageUrl: 'img/chuxing.jpg', ImageName: '理赔申请书', PageNo: 1},
		],
		'7612161': [
			{ImageUrl: 'img/baobao.gif', ImageName: '身份证（正反面）', PageNo: 1},
			{ImageUrl: 'img/yongruizhongshen.png', ImageName: '身份证（正反面）', PageNo: 2},
		],
		'7613161': [
			{ImageUrl: 'img/tuantiyinian.gif', ImageName: '住院病历、出院小结', PageNo: 1},
			{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: '住院病历、出院小结', PageNo: 2},
		],
		'7614161': [
			{ImageUrl: 'img/tuantiyinian.gif', ImageName: '门诊病历', PageNo: 1},
			{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: '门诊病历', PageNo: 2},
		],
		'7615161': [
			{ImageUrl: 'img/zhuoyuecaifu.gif', ImageName: '医疗费数据原件', PageNo: 1},
			{ImageUrl: 'img/yongyingliangquan.gif', ImageName: '医疗费数据原件', PageNo: 2},
			{ImageUrl: 'img/yongtailiangquan.gif', ImageName: '医疗费数据原件', PageNo: 3},
			{ImageUrl: 'img/feiyongbuchang.gif', ImageName: '医疗费数据原件', PageNo: 4},
		],
		'7616161': [
			{ImageUrl: 'img/yongyujiaoyu.gif', ImageName: '受益人银行卡或存折', PageNo: 1},
			{ImageUrl: 'img/yanglaoguihua.gif', ImageName: '受益人银行卡或存折', PageNo: 2},
		]
	}

	$scope.actions = {
		toSave: function() {
			PageFunc.message('尊敬的客户，您好，根据您 '+ $filter('date')(new Date(), 'yyyy-MM-dd') +' 提交的姓名为'+ $scope.lp.truename +'的自助理赔申请，需要提供您本次申请的理赔申请书原件、医疗收据发票或清单原件（如果已在其他公司报销，则提供发票复印件和分割单原件），我司已开通上门收件服务，请点击“确定”接钮进行预约，预约成功后我们会及时与您联系。', null, '理赔预约').then(function(res) {		
				$state.go('user.bespeak');
			});
		}
	}

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.uploadImages = angular.extend({}, uploadImgConfig);
		if ($scope.lp.inHospital === true) {
			delete $scope.uploadImages[4];		
		} else {
			delete $scope.uploadImages[3];
		}		
	});

}])

.controller('userClaimScheduleCtrl', ['$scope', function($scope){
	$scope.basicInfos = [
		{
			Name: '事故人姓名',
			RgtNo: '124558754442200004',
			InsuredNo: '0001245',
			IDNo: '330105198909152231',
			IDType: '身份证',
			Status: '已结案',
			Missions: [
				{date: '2016-06-11', state: '事故发生时间'},
				{date: '2016-06-11', state: '理赔申请时间'},
				{date: '2016-06-11', state: '已结案'},
			]
		},
		{
			Name: '事故人姓名',
			RgtNo: '124558754442215488',
			InsuredNo: '0001245',
			IDNo: '330105198909152231',
			IDType: '身份证',
			Status: '审核中',
			Missions: [
				{date: '2016-06-11', state: '事故发生时间'},
				{date: '2016-06-11', state: '理赔申请时间'},
			]
		},
	];


	$scope.actions = {
		doRefresh: function() {
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

}])
.controller('userMyclaimCtrl', ['$scope', function($scope){

	$scope.basicInfos = [
		{
			Name: '事故人姓名',
			RgtNo: '124558754442200004',
			InsuredNo: '0001245',
			IDNo: '330105198909152231',
			IDType: '身份证',
			accidentDate: new Date(),
			accidentAmount: 800,
			Status: '已完成',
		},
		{
			Name: '事故人姓名',
			RgtNo: '124558754442215488',
			InsuredNo: '0001245',
			IDNo: '330105198909152231',
			IDType: '身份证',
			accidentDate: new Date(),
			accidentAmount: 1350.26,
			Status: '已完成',
		},
	];


	$scope.actions = {
		doRefresh: function() {
			$scope.$broadcast('scroll.refreshComplete');
		}
	};
}])

.controller('userMyclaimItemCtrl', ['$scope', '$stateParams', function($scope, $stateParams){
	

	var uploadImgConfig = {
		'1': {
			id: '7601121',
			title: '理赔申请书',
			isMore: true,
			description: '请上传理赔申请书资料'
		},
		2: {
			id: '7612161',
			title: '身份证（正反面）',
			isMore: true,
			description: '请上传身份证的（正反面）'
		},
		3: {
			id: '7613161',
			title: '住院病历、出院小结',
			isMore: true,
			description: '住院病历、出院小结（包括门诊病历的首页个人信息）'
		},
		4: {
			id: '7614161',
			title: '门诊病历',
			isMore: true,
			description: '门诊病历（包括病历首页的个人信息）'
		},
		5: {
			id: '7615161',
			title: '医疗费数据原件',
			isMore: true,
			description: '医疗费数据原件即明细清单'
		},
		6: {
			id: '7616161',
			title: '受益人银行卡或存折',
			isMore: true,
			description: '受益人银行卡或存折（受益人是指被保险人本人）'
		}
	};

	$scope.basicInfo = {
		ApplyInfo: {
			AppntNo: '0122145',
			IDNo: '330105198909152231',
			IDType: '身份证',			
		},
		AccidentInfo: {
			Name: '事故人姓名',
			InsuredNo: '0001245',
			IDNo: '330105198909152231',
			IDType: '身份证',
		},
		RgtNo: '124558754442200004',
		Status: '已完成',
		accidentAmount: 1350.26,
		inHospital: true,
		accidentDate: new Date(),
		accidentSite: '浙江省杭州市西湖区',
		Missions: [
			{date: '2016-06-11', state: '事故发生时间'},
			{date: '2016-06-11', state: '理赔申请时间'},
			{date: '2016-06-11', state: '已结案'},
		],

		imagePages: {
			'7601121': [
				{ImageUrl: 'img/chuxing.jpg', ImageName: '理赔申请书', PageNo: 1},
			],
			'7612161': [
				{ImageUrl: 'img/baobao.gif', ImageName: '身份证（正反面）', PageNo: 1},
				{ImageUrl: 'img/yongruizhongshen.png', ImageName: '身份证（正反面）', PageNo: 2},
			],
			'7613161': [
				{ImageUrl: 'img/tuantiyinian.gif', ImageName: '住院病历、出院小结', PageNo: 1},
				{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: '住院病历、出院小结', PageNo: 2},
			],
			'7615161': [
				{ImageUrl: 'img/zhuoyuecaifu.gif', ImageName: '医疗费数据原件', PageNo: 1},
				{ImageUrl: 'img/yongyingliangquan.gif', ImageName: '医疗费数据原件', PageNo: 2},
				{ImageUrl: 'img/yongtailiangquan.gif', ImageName: '医疗费数据原件', PageNo: 3},
				{ImageUrl: 'img/feiyongbuchang.gif', ImageName: '医疗费数据原件', PageNo: 4},
			],
			'7616161': [
				{ImageUrl: 'img/yongyujiaoyu.gif', ImageName: '受益人银行卡或存折', PageNo: 1},
				{ImageUrl: 'img/yanglaoguihua.gif', ImageName: '受益人银行卡或存折', PageNo: 2},
			]
		},
	};

	$scope.actions = {
		doRefresh: function() {
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.uploadImages = angular.extend({}, uploadImgConfig);
		if ($scope.basicInfo.inHospital === true) {
			delete $scope.uploadImages[4];		
		} else {
			delete $scope.uploadImages[3];
		}		
	});


}])

.controller('userClaimNoticeCtrl', ['$scope', function($scope){
	
}])

.controller('userMineCtrl', ['$scope', '$ionicPopup', '$q', '$ionicActionSheet', '$cordovaCamera', '$cordovaFileTransfer', 'Storage', 'User', '$timeout', 'PageFunc', 'CONFIG', 'Token', '$stateParams', function ($scope, $ionicPopup, $q, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, Storage, User, $timeout, PageFunc, CONFIG, Token, $stateParams) {
	var init = function () {
		var deferred = $q.defer();
		var deferredInfo = $q.defer(), 
			deferredBarcode = $q.defer(); 
		User.initAccInfo($scope).then(function (data) { 
			deferredInfo.resolve(data);
		}, function (err) {
			deferredInfo.reject(err);
		});

		$q.all([deferredInfo.promise]).then(function (data) { 
			
			//console.log($scope.accountInfo.barcode);
			deferred.resolve();
		}, function (errors) {
			console.log(errors);
			deferred.reject();
		});
		return deferred.promise;
	};


	$scope.actions = {        
		doRefresh: function() {
			init()
			.catch(function (err) { 
				console.log(err);
			})
			.finally(function () {
				$scope.$broadcast('scroll.refreshComplete');
			});
		},		
    chgHead: function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
               { text: '<b>拍摄头像</b>' },
               { text: '相册照片' }
            ],
            titleText: '设置头像',
            cancelText: '取消',
            cancel: function() {
            },
            buttonClicked: function(index) {
                cameraOptions.allowEdit = true;
                cameraOptions.targetWidth = 800;
                cameraOptions.targetHeight = 800;
                cameraOptions.cameraDirection = 1;
                switch (index) {
                    case 0: {
                        cameraOptions.sourceType = 1;
                    }
                    break;
                    case 1: {
                        cameraOptions.sourceType = 2;
                    }
                    break;
                }
                if (!(window.navigator && window.navigator.camera)) {
                    return console.log('不支持window.navigator.camera');
                }
                $cordovaCamera.getPicture(cameraOptions).then(function (imageURI) {
                    $timeout(function () {
                        var serverUrl = encodeURI(CONFIG.baseUrl + CONFIG.userResUploadPath);
                        uploadOptions.headers = {Authorization: 'Bearer ' + Storage.get('token')};
                        uploadOptions.fileName = 'userHead' + CONFIG.uploadOptions.fileExt;
                        uploadOptions.params = {method: '$set', dest: 'head', replace: true}; 
                        PageFunc.confirm('是否上传?', '上传头像').then(function (res) {
                            if (res) {
                                if (!window.FileTransfer) {
                                    return console.log('不支持window.fileTransfer');
                                }
                                return $cordovaFileTransfer.upload(serverUrl, imageURI, uploadOptions, true).then(function (result) {
                                    $scope.pageHandler.progress = 0;
                                    $scope.accountInfo.user.head = {Url: JSON.parse(result.response).results.Url};
                                    try {
                                        $cordovaCamera.cleanup().then(function () { 
                                            console.log("Camera cleanup success.");
                                        }, function (err) {
                                            console.log(err);
                                        });
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }, function (err) {
                                    console.log(err);
                                    $scope.error.headError = err;
                                    $scope.pageHandler.progress = 0;
                                    try {
                                        $cordovaCamera.cleanup().then(function () { 
                                            console.log("Camera cleanup success.");
                                        }, function (err) {
                                            console.log(err);
                                        });
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }, function (progress) {
                                    $scope.pageHandler.progress = progress.loaded / progress.total * 100;
                                });
                            }
                            $scope.pageHandler.progress = 0;
                            $scope.error.headError = '取消上传!';
                            try {
                                $cordovaCamera.cleanup().then(function () { 
                                    console.log("Camera cleanup success.");
                                }, function (err) {
                                    console.log(err);
                                });
                            }
                            catch (e) {
                                console.log(e);
                            }
                        });
                    }, 0);
                }, function (err) {
                    $scope.error.headError = err;
                    console.log(err);
                });
                return true;
            }
        });
    },
    logout: function () {
        User.logout($scope);
    }
	};
	$scope.$on('$ionicView.beforeEnter', function () {
		init();
	});
}])
;