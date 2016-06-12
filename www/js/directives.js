angular.module('yiyangbao.directives', [])
.directive("buttonClearInput", function () {
    return {
        restrict: "AE",
        scope: {
            input: "=" 
        },
        template: "<button ng-if='input' class='button button-icon ion-android-close input-button' type='button' ng-click='clearInput()'></button>",
        controller: function ($scope, $element, $attrs) {
            $scope.clearInput = function () {
                $scope.input = "";
            };
        }
    };
})
;