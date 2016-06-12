angular.module('yiyangbao.filters', [])
.filter('mapGender', function () {
    var genderHash = {
        1: '男',
        2: '女',
        3: '未知',
        4: '未申明',
        5: '其他',
        '男': '男',
        '女': '女',
        male: '男',
        female: '女'
    };
    return function (input) {
        if (!input) {
            return '未知';
        } else {
            return genderHash[input] || '未知';
        }
    };
})
.filter('mapTitle', function () {
    var genderHash = {
        1: '先生',
        2: '女士'
    };
    return function (input) {
        if (!input) {
            return '用户';
        } else {
            return genderHash[input] || '用户';
        }
    };
})
.filter('maskMobile', function () {
    return function (input) {
        if (!input) {
            return null;
        } else {
            return input.replace(/^(.{3}).{4}(.{4})/, '$1*****$2');
        }
    };
})
.filter('maskEmail', function () {
    return function (input) {
        if (!input) {
            return null;
        } else {
            return input.replace(/^(.{1}).*?(@.+)$/, '$1**$2');
        }
    };
})
.filter('maskIdNo', function () {
    return function (input) {
        if (!input) {
            return null;
        } else {
            return input.replace(/^(.{6}).*(.{1})$/, '$1***********$2');
        }
    };
})
.filter('recptImgLen', function () {
    return function (input, type) {
        return input.filter(function (img) {
            return img.type === type;
        }).length;
    };
})
;