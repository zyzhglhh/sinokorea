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

.controller('userHome', ['$scope', '$q', '$timeout', 'PageFunc', 'Storage', 'User', 'Claim', '$ionicHistory', function($scope, $q, $timeout, PageFunc, Storage, User, Claim, $ionicHistory){

	var initCount = function() {
		Claim.getMessageCount().then(function(data) {
			$scope.newMessageCount = data.count;
		}, function(err) {
			console.log(err);
		});
	};


	$scope.actions = {        
		doRefresh: function() {
			initCount();			
			$scope.$broadcast('scroll.refreshComplete');			
		}
	};

	$scope.$on('$ionicView.beforeEnter', function () {
		initCount();
	});

}])


.controller('userBespeakCtrl', ['$scope', '$state', 'PageFunc', function($scope, $state, PageFunc){
	$scope.bespeak = {
		linker: '吴永松',
		tel: '15888800143',
		address: '浙江省杭州市西湖区浙江大学玉泉'
	};
	$scope.actions = {
		toSubmit: function() {
			var msg = '';
			if ( $scope.bespeak.linker == '') {
				msg += '请填写联系人!' + '<br />';
			}
			if ( $scope.bespeak.tel == '') {
				msg += '请填写联系人电话!' + '<br />';
			}
			if ( $scope.bespeak.address == '') {
				msg += '请填写联系地址!' + '<br />';
			}

			if ( msg.length > 0 ) {
				PageFunc.message(msg, 5000, '填写信息').then(function(res){

				});
			} else {
				PageFunc.message('我们会在2-3个工作日内与您联系。', null, '预约成功').then(function(res) {
					$state.go('user.claimschedule');
				})
				
			}
		}
	}
}])


.controller('userClaimingCtrl', ['$scope', '$state', '$filter', '$ionicHistory', 'Storage', 'PageFunc', 'Claim', 'DateTime', function($scope, $state, $filter, $ionicHistory, Storage, PageFunc, Claim, DateTime){

	var userInfo = JSON.parse(Storage.get('info'));
	var location = userInfo.personalInfo.location || {};
	var state = location.state && location.state.name || '';
	var city = location.city && location.city.name || '';
	var district = location.district && location.district.name || '';

	var accidentSite =  state + city + district;
	var address = state + city + district + (location.street || '');


	$scope.lp = {
		mobile: userInfo.mobile || '',
		accidentDate: new Date(),
		accidentSite: accidentSite,
		isReal: true,
		bespokeLinker: userInfo.personalInfo.name,
		bespokeTel: userInfo.mobile,
		bespokeAddress: address,
		relation: {}
	};
	$scope.config = {		
		RelationList: [],
		bespokeDates: []
	}

	DateTime.getWorkDate(3).forEach(function(dt) {
		$scope.config.bespokeDates.push({
			id: $filter('date')(dt, 'yyyyMMdd'),
			value: $filter('date')(dt, 'yyyy-MM-dd')
		});
	});

	$scope.actions = {
		chgRelation: function() {
			
			$scope.lp.truename = $scope.lp.relation.Name[0];
			$scope.lp.idNo = $scope.lp.relation.IDNo[0];
			$scope.lp.appntNo = $scope.lp.relation.AppntNo[0];
			$scope.lp.idType = $scope.lp.relation.IDType[0];
			$scope.lp.relationType = $scope.lp.relation.RelationType[0];

		},
		toContinue: function() {
			var msg = '';
			if (typeof $scope.lp.relation === 'undefined') {
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

			if ( typeof $scope.lp.bespokeLinker === 'undefined' || $scope.lp.bespokeLinker == '') {
				msg += '<br />预约联系人不能为空';
			}

			if ( typeof $scope.lp.bespokeTel === 'undefined' || $scope.lp.bespokeTel == '') {
				msg += '<br />预约联系人电话不能为空';
			}

			if ( typeof $scope.lp.bespokeAddress === 'undefined' || $scope.lp.bespokeAddress == '') {
				msg += '<br />预约联系地址不能为空';
			}

			if ( typeof $scope.lp.bespokeDate === 'undefined' || $scope.lp.bespokeDate == '') {
				msg += '<br />请选择预约时间';
			}

			if ( msg.length > 0) {
				PageFunc.message(msg, 5000, '填写信息');
			} else {
				$state.go('user.claimingupload', {lp: $scope.lp})
			}
			

		}
	}

	Claim.getRelation().then(function(data) {
		
		$scope.config.RelationList = data.result[0]['Response'][0]['RelationList'][0]['Relation'];
		$scope.lp.relation = $scope.config.RelationList[0];

		$scope.actions.chgRelation();
	}, function(err) {
		console.log(err);
	})



	$scope.$on("$ionicView.beforeEnter", function(event, data){
		/*if (! $ionicHistory.forwardView()) {
			PageFunc.message('1、请确认出险属实，故意伪造证明材料属于违法行为，需承担法律责任。<br \>2、我们将以收到您“齐全”的索赔资料作为理赔受理时间;资料不全的我们会以短信方式及时通知您。', null, '自助理赔服务须知').then(function(res) {		
			});
		}*/
	   
	});
}])

.controller('userClaimingUploadCtrl', ['$scope', '$state', '$stateParams', '$filter', '$ionicActionSheet', '$cordovaFileTransfer', '$interval', 'Storage', 'PageFunc', 'CONFIG', 'Common', 'Claim', function($scope, $state, $stateParams, $filter, $ionicActionSheet, $cordovaFileTransfer, $interval, Storage, PageFunc, CONFIG, Common, Claim) {
	$scope.lp = $stateParams.lp;
	
	var uploadImgConfig = CONFIG.uploadImgConfig;
	var claimNo = Common.dateRndNo(4);

	$scope.imagePages = {};

	/*$scope.imagePages = {
		'7601121': [
			{ImageUrl: 'img/chuxing.jpg', ImageName: 'chuxing1.jpg', PageNo: 1},
			{ImageUrl: 'img/chuxing.jpg', ImageName: 'chuxing2.jpg', PageNo: 2},
			{ImageUrl: 'img/chuxing.jpg', ImageName: 'chuxing3.jpg', PageNo: 3},
			{ImageUrl: 'img/chuxing.jpg', ImageName: 'chuxing4.jpg', PageNo: 4},
			{ImageUrl: 'img/chuxing.jpg', ImageName: 'chuxing5.jpg', PageNo: 5},
		],
		'7612161': [
			{ImageUrl: 'img/baobao.gif', ImageName: 'baobao1.gif', PageNo: 1},
			{ImageUrl: 'img/yongruizhongshen.png', ImageName: 'baobao2.gif', PageNo: 2},
		],
		'7613161': [
			{ImageUrl: 'img/tuantiyinian.gif', ImageName: '住院病历、出院小结', PageNo: 1},
			{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: '住院病历、出院小结', PageNo: 2},
		],
		'7614161': [
			{ImageUrl: 'img/tuantiyinian.gif', ImageName: 'tuantiyinian1.gif', PageNo: 1},
			{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: 'tuantiyinian2.gif', PageNo: 2},
		],
		'7615161': [
			{ImageUrl: 'img/zhuoyuecaifu.gif', ImageName: 'yongyingliangquan1.gif', PageNo: 1},
			{ImageUrl: 'img/yongyingliangquan.gif', ImageName: 'yongyingliangquan2.gif', PageNo: 2},
			{ImageUrl: 'img/yongtailiangquan.gif', ImageName: 'yongyingliangquan3.gif', PageNo: 3},
			{ImageUrl: 'img/feiyongbuchang.gif', ImageName: 'yongyingliangquan4.gif', PageNo: 4},
		],
		'7616161': [
			{ImageUrl: 'img/yongyujiaoyu.gif', ImageName: 'yongyujiaoyu1.gif', PageNo: 1},
			{ImageUrl: 'img/yanglaoguihua.gif', ImageName: 'yongyujiaoyu2.gif', PageNo: 2},
		]
	}*/

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.uploadImages = angular.extend({}, uploadImgConfig);
		if ($scope.lp.inHospital === true) {
			delete $scope.uploadImages['7614161'];		
		} else {
			delete $scope.uploadImages['7613161'];
		}

		$scope.actions.checkSubmitEnabled();
	});

	$scope.stopinterval = null;
	$scope.progress = {
		isProgressEnabled : false,
		progressval: 0,
		imageCount: 0,
		progressMax: 0,
		progressUnitVal: 0
	}

	$scope.actions = {
		toUploadImages: function() {
			/*PageFunc.message('尊敬的客户，您好，根据您 '+ $filter('date')(new Date(), 'yyyy-MM-dd') +' 提交的姓名为'+ $scope.lp.truename +'的自助理赔申请，需要提供您本次申请的理赔申请书原件、医疗收据发票或清单原件（如果已在其他公司报销，则提供发票复印件和分割单原件），我司已开通上门收件服务，请点击“确定”接钮进行预约，预约成功后我们会及时与您联系。', null, '理赔预约').then(function(res) {		
				$state.go('user.bespeak');
			});*/
			$scope.imgUploadings = Object.keys($scope.uploadImages).filter(function(item){				

				return (typeof $scope.imagePages[item] !=='undefined' && $scope.imagePages[item].length > 0) ? false : true;
			});
			if ( $scope.imgUploadings.length===0) {
				$scope.imgUploadings = Object.keys($scope.uploadImages);
			}
			$scope.actions.showModal();
		},
		toClickImage: function(id) {
			$scope.imgUploadings = [id];

			$scope.actions.showModal();
		},
		showModal: function() {
			if ( $scope.claimPicsModal) {
				$scope.claimPicsModal.show();
			} else {
				Claim.claimPicsModal($scope);
			}
		},
		checkSubmitEnabled : function(){
		    $scope.isSubmitEnabled = Object.keys($scope.uploadImages).length === Object.keys($scope.imagePages).length
		},
		addClaim: function() {
			Claim.addClaim({claimNo: claimNo}).then(function(data) {
				$state.go('user.claimschedule', {}, {reload: true});
			}, function(err) {
				
				PageFunc.message(err.data, 5000, '提示信息').then(function(res) {
					$state.go('user.claimschedule', {}, {reload: true});
				})
			});
		},
		toSubmit: function() {
			delete $scope.lp.relation;
			
			// $scope.actions.addClaim();

			if (!window.FileTransfer) {
				return console.log('不支持window.FileTransfer');
			}

			$scope.isSubmitEnabled = false;
			for(var pid in $scope.imagePages) {
				$scope.progress.imageCount += $scope.imagePages[pid].length;
			}

			$scope.progress.isProgressEnabled = true;
			$scope.progress.progressMax = $scope.progress.imageCount * 100;

			serverUrl = encodeURI(CONFIG.baseUrl + CONFIG.skApiResUploadPath);
			var uploadOptions = angular.copy(CONFIG.uploadOptions);
			uploadOptions.headers = {Authorization: 'Bearer ' + Storage.get('token')};
      uploadOptions.fileName = 'imgTitle' + CONFIG.uploadOptions.fileExt;
      uploadOptions.params = {claimData: JSON.stringify($scope.lp), claimNo: claimNo}; 

      var progressPopup = PageFunc.progress('上传资料', $scope);	
      
			for(var pitem in $scope.imagePages) {
				$scope.imagePages[pitem].forEach(function(item) {
					uploadOptions.params['subType'] = item.subType;
					uploadOptions.params['subTitle'] = item.subTitle;

					$cordovaFileTransfer.upload(serverUrl, item.ImageUrl, uploadOptions, true)
						.then(function(result) {

						}, function(err) {
							$scope.error.claimPicsError = err;
						}, function(progressobj) {
							$scope.progress.progressval = $scope.progress.progressval + progressobj.loaded;
						});


					$scope.progress.progressUnitVal++;
				});				
			}
			
			
			startprogress();
		}

	}

	function startprogress() {	
		var progressPopup = PageFunc.progress('上传资料', $scope);	
		$scope.progress.progressval = 0;
		if ( $scope.stopinterval ) {
			$interval.cancel($scope.stopinterval);
		}

		$scope.stopinterval = $interval(function() {
			$scope.progress.progressval = $scope.progress.progressval + 10;

			if ($scope.progress.progressval % 100 === 0) {
				$scope.progress.progressUnitVal++;
			}
			
			if ( $scope.progress.progressval >= $scope.progress.progressMax) {
				$interval.cancel($scope.stopinterval);
				//等图片都已经上传到我们自己的服务器上之后，再调用addClaim()方法提交到中韩接口同时把附件传到对方的FTP服务器上
				$scope.actions.addClaim();
				return;
			}
		}, 100);

	}
	

}])

.controller('userClaimScheduleCtrl', ['$scope', 'Claim', function($scope, Claim){
	$scope.basicInfos = [];

	var initCalims = function() {
		Claim.getClaims({}).then(function(data){
			$scope.basicInfos = data.results;
		}, function(err) {
			console.log(err);
		});
	}
	


	$scope.actions = {
		doRefresh: function() {
			initCalims();
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	initCalims();

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

.controller('userMyclaimItemCtrl', ['$scope', '$stateParams', 'Claim', function($scope, $stateParams, Claim){
	
	var query = {rgtNo: $stateParams.rgtNo};
	var initClaimInfo = function() {
		Claim.getClaimInfo(query).then(function(data) {
			$scope.basicInfo = data.results;

			Claim.getClaimSchedule(query).then(function(data) {
				$scope.basicInfo.Missions = data.result;
			}, function(err) {
				console.log(err);
			})
		}, function(err) {
			console.log(err);
		})
	};

/*	var uploadImgConfig = {
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
	};
*/
/*	$scope.basicInfo = {
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
*/
	$scope.actions = {
		doRefresh: function() {
			initClaimInfo();
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	initClaimInfo();

}])

.controller('userClaimNoticeCtrl', ['$scope', function($scope){
	
}])

.controller('espushCtrl', ['$scope', 'Claim', function($scope, Claim) {

	var initEspushs = function() {
		Claim.getESPush().then(function(data) {
			$scope.espushs = data.results;
		}, function(err) {
			console.log(err);
		});
	}

	$scope.actions = {
		doRefresh: function() {
			initEspushs();
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	initEspushs();

}])

.controller('espushItemCtrl', ['$scope', '$state', '$stateParams', 'PageFunc', 'CONFIG', 'Claim', function($scope, $state, $stateParams, PageFunc, CONFIG, Claim) {
	
	//$scope.esinfo = {};
	$scope.uploadImages = {};

	$scope.uploadImgConfig = CONFIG.uploadImgConfig;
	var initClaimInfo = function() {
		Claim.getClaimInfo({rgtNo: $stateParams.id}).then(function(data) {
			$scope.basicInfo = data.results;

			$scope.esinfo = $scope.basicInfo.esPushInfo.filter(function(item) {
				return item.issuepolNo === $stateParams.issuepolNo;
			})[0];

			$scope.esinfo.subList.forEach(function(item) {
				$scope.uploadImages[item.subType] = $scope.uploadImgConfig[item.subType];
			})

		}, function(err) {
			console.log(err);
		})
	}


	$scope.imagePages = {};
	$scope.imagePages = {
		'7601121': [
			{ImageUrl: 'img/chuxing.jpg', ImageName: '理赔申请书', PageNo: 1},
			{ImageUrl: 'img/chuxing.jpg', ImageName: '理赔申请书', PageNo: 2},
		],
		'7614161': [
			{ImageUrl: 'img/tuantiyinian.gif', ImageName: '门诊病历', PageNo: 1},
			{ImageUrl: 'img/zhiyingcaifu.gif', ImageName: '门诊病历', PageNo: 2},
		],
	}

	$scope.actions = {
		toUploadImages: function() {
			/*PageFunc.message('尊敬的客户，您好，根据您 '+ $filter('date')(new Date(), 'yyyy-MM-dd') +' 提交的姓名为'+ $scope.lp.truename +'的自助理赔申请，需要提供您本次申请的理赔申请书原件、医疗收据发票或清单原件（如果已在其他公司报销，则提供发票复印件和分割单原件），我司已开通上门收件服务，请点击“确定”接钮进行预约，预约成功后我们会及时与您联系。', null, '理赔预约').then(function(res) {		
				$state.go('user.bespeak');
			});*/
			$scope.imgUploadings = Object.keys($scope.uploadImages).filter(function(item){		

				return (typeof $scope.imagePages[item] !=='undefined' && $scope.imagePages[item].length > 0) ? false : true;
			});
			if ( $scope.imgUploadings.length===0) {
				$scope.imgUploadings = Object.keys($scope.uploadImages);
			}
			$scope.actions.showModal();
		},
		showModal: function() {
			if ( $scope.claimPicsModal) {
				$scope.claimPicsModal.show();
			} else {
				Claim.claimPicsModal($scope);
			}
		},		
		checkSubmitEnabled : function(){
		    $scope.isSubmitEnabled = Object.keys($scope.uploadImages).length === Object.keys($scope.imagePages).length
		},
		toClickImage: function(id) {
			$scope.imgUploadings = [id];

			$scope.actions.showModal();
		},
		doRefresh: function() {
			initClaimInfo();
			$scope.$broadcast('scroll.refreshComplete');
		},
		addClaimEspush: function() {
			Claim.addClaimEspush({
				rgtNo: $scope.basicInfo.rgtNo,
				issuepolNo: $scope.esinfo.issuepolNo
			}).then(function(data) {
				$state.go('user.claimschedule', {}, {reload: true});
			}, function(err) {				
				PageFunc.message(err.data, 5000, '提示信息').then(function(res) {					
				})
			});
		},
		toSubmit: function() {
			$scope.actions.addClaimEspush();

			if (!window.FileTransfer) {
				return console.log('不支持window.FileTransfer');
			}

			$scope.isSubmitEnabled = false;
			for(var pid in $scope.imagePages) {
				$scope.progress.imageCount += $scope.imagePages[pid].length;
			}

			$scope.progress.isProgressEnabled = true;
			$scope.progress.progressMax = $scope.progress.imageCount * 100;

			serverUrl = encodeURI(CONFIG.baseUrl + CONFIG.skApiResUploadPath);
			var uploadOptions = angular.copy(CONFIG.uploadOptions);
			uploadOptions.headers = {Authorization: 'Bearer ' + Storage.get('token')};
      uploadOptions.fileName = 'imgTitle' + CONFIG.uploadOptions.fileExt;
      uploadOptions.params = {rgtNo: $scope.basicInfo.rgtNo, issuepolNo: $scope.esinfo.issuepolNo}; 

      var progressPopup = PageFunc.progress('上传资料', $scope);	
      
			for(var pitem in $scope.imagePages) {
				$scope.imagePages[pitem].forEach(function(item) {
					uploadOptions.params['subType'] = item.subType;
					$cordovaFileTransfer.upload(serverUrl, item.ImageUrl, uploadOptions, true)
						.then(function(result) {

						}, function(err) {
							$scope.error.claimPicsError = err;
						}, function(progressobj) {
							$scope.progress.progressval = $scope.progress.progressval + progressobj.loaded;
						});


					$scope.progress.progressUnitVal++;
				});				
			}
			
			
			//startprogress();
		}
	};

	function startprogress() {	
		var progressPopup = PageFunc.progress('上传资料', $scope);	
		$scope.progress.progressval = 0;
		if ( $scope.stopinterval ) {
			$interval.cancel($scope.stopinterval);
		}

		$scope.stopinterval = $interval(function() {
			$scope.progress.progressval = $scope.progress.progressval + 10;

			if ($scope.progress.progressval % 100 === 0) {
				$scope.progress.progressUnitVal++;
			}
			
			if ( $scope.progress.progressval >= $scope.progress.progressMax) {
				$interval.cancel($scope.stopinterval);


				// 影像问题件都已经上传到我们自己的服务器成功之后，再将这个数据提交到中韩接口平台并且我们服务器的影像件FTP到中韩服务器
				$scope.actions.addClaimEspush();

				return;
			}
		}, 100);

	}

	initClaimInfo();
}])

.controller('userMineCtrl', ['$scope', '$ionicPopup', '$q', '$ionicActionSheet', '$cordovaCamera', '$cordovaFileTransfer', 'Storage', 'User', '$timeout', 'PageFunc', 'CONFIG', 'Token', '$stateParams', function ($scope, $ionicPopup, $q, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, Storage, User, $timeout, PageFunc, CONFIG, Token, $stateParams) {
	var init = function () {
		var deferred = $q.defer();
		var deferredInfo = $q.defer(), 
			deferredBarcode = $q.defer(); 
		User.initInfo($scope).then(function (data) { 
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