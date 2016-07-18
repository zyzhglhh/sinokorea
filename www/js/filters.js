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
.filter('claimStateText', function() {
    var hash = {
        0: '提交中',
        1: '审核中',
        9: '完成'
    };
    return function(input) {
        return hash[input] || ''
    }
})
.filter('idTypeText', function() {
    var hash = {
        0: '身份证',
        1: '护照',
        2: '军人证(军官证)',
        3: '驾照',
        4: '户口本',
        5: '学生证',
        6: '工作证',
        7: '出生证',
        8: '其他',
        9: '无证件',
        A: '士兵证',
        B: '回乡证',
        C: '临时身份证',
        D: '警官证',
        E: '台胞证',
        F: '港、澳、台通行证'
    };
    return function(input) {
        return hash[input] || hash[8];
    }
})
.filter('relationText', function() {
    var hash = {
        '00': '本人',
        '01': '父母',
        '02': '配偶',
        '03': '子女',
        '06': '其他'
    };
    return function(input) {
        return hash[input] || hash['06'];
    }
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