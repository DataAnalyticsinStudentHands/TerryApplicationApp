/*global angular, console*/

/**
 * @ngdoc function
 * @name myapplication.controller:MyCourseworkController
 * @description
 * # MyCourseworkController
 * Controller for the terry
 */
angular.module('TerryControllers').controller('MyCourseworkController', function ($scope, ngNotify, $stateParams, $state, $filter, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, MyCourseworkService) {
    'use strict';

    $scope.myVariables = {
        current_mode: 'Add',
    };

    $scope.mycourses = {};
    $scope.mycourse = {};
    var currentLevel = "sophomore";

    // GET
    MyCourseworkService.getAllCoursework().then(
        function (result) {
            $scope.mycourses = result;
        },
        function (error) {
            console.error(error);
            ngNotify.set("Something went wrong retrieving data.", {
                type: "error",
                sticky: true
            });
        }
    );

    // callback for ng-click 'deleteCourse':
    $scope.deleteCourse = function (courseId) {
        $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete your course from the list?'
        }).then(function (res) {
            if (res) {
                MyCourseworkService.deleteCoursework(courseId).then(
                    function (success) {
                        $scope.updateLists();
                    }
                );
            } else {
                console.log('User are not sure to delete');
            }
        });
    };

    // callback for ng-click 'editCourse':
    $scope.editCourse = function (course) {
        $scope.myVariables.current_mode = "Edit";
        $scope.mycourse = course;
        var test = $filter('filter')($scope.course_types, {
            abbreviation: $scope.mycourse.type
        }, true);
        $scope.myVariables.myCourseType = test[0];
        $scope.modal.show();
    };

    // callback for ng-click 'saveModal':
    $scope.saveModal = function () {
        $scope.mycourse.application_id = $stateParams.applicationId;
        $scope.mycourse.level = currentLevel;
        $scope.mycourse.type = $scope.myVariables.myCourseType.abbreviation;

        if ($scope.mycourse.name && $scope.mycourse.credit_hours && $scope.mycourse.final_grade) {

            if ($scope.myVariables.current_mode === 'Add') {
                MyCourseworkService.addCoursework($scope.mycourse).then(
                    function (result) {
                        $scope.updateLists();
                        ngNotify.set("Succesfully added your coursework.", {
                            position: 'bottom',
                            type: 'success'
                        });
                        $scope.modal.hide();
                    },
                    function (error) {
                        ngNotify.set("Could not contact server to add coursework!", {
                            position: 'bottom',
                            type: 'error'
                        });
                    }
                );
            } else {
                MyCourseworkService.updateCoursework($scope.mycourse.id, $scope.mycourse).then(
                    function (result) {
                        $scope.updateLists();
                        ngNotify.set("Succesfully updated your coursework.", {
                            position: 'bottom',
                            type: 'success'
                        });
                        $scope.modal.hide();
                    },
                    function (error) {
                        ngNotify.set("Could not contact server to update coursework!", {
                            position: 'bottom',
                            type: 'error'
                        });
                    }
                );
            }
        } else {
            ngNotify.set("Remember to fill in everything!", {
                position: 'bottom',
                type: 'error'
            });
        }
    };

    // callback for ng-click 'modal'- open Modal dialog to add a new course
    $ionicModal.fromTemplateUrl('templates/modal_coursework.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.myCourseType = $scope.course_types[0];
        $scope.modal = modal;
    });

    // Open the modal
    $scope.showAddCourse = function (level) {
        // Set some variables to default values
        $scope.myVariables.current_mode = "Add";
        $scope.myVariables.myCourseType = $scope.course_types[0];
        $scope.mycourse = {};
        $scope.modal.show();
        var test = $filter('filter')($scope.levels, {
            id: level
        }, true);
        currentLevel = test[0].name;
    };


    // Update lists
    $scope.updateLists = function () {
        MyCourseworkService.getAllCoursework().then(
            function (result) {
                $scope.mycourses = result;
            },
            function (error) {
                console.error(error);
                ngNotify.set("Something went wrong retrieving data.", {
                    type: "error",
                    sticky: true
                });
            }
        );
    };

    // Toggle open/close side menu
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.course_types = [
        {
            "name": "Advanced Placement",
            "abbreviation": "AP"
        },
        {
            "name": "International Baccalaureate Program",
            "abbreviation": "IB"
        },
        {
            "name": "Dual Credit",
            "abbreviation": "DC"
        }
    ];

    $scope.levels = [
        {
            "id": 1,
            "name": "sophomore"
        },
        {
            "id": 2,
            "name": "junior"
        },
        {
            "id": 3,
            "name": "senior"
        }
    ];
});