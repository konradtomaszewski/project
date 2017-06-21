(function() {
  'use strict';
  
	angular
		.module("myApp", ['ngRoute', 'ngMaterial', 'ngMessages'])
		.controller('people', people)
		.controller('PanelGroupsCtrl', PanelGroupsCtrl)
		.controller('PanelMenuCtrl', PanelMenuCtrl)
		.controller('AppCtrl', AppCtrl)
		.controller('DemoCtrl', DemoCtrl)
		.config(['$routeProvider',
				function($routeProvider) {
					$routeProvider
						.when('/showAllChars', {
							title: 'Lista osób',
							templateUrl: 'charList.html',
							controller: 'people'
						})
						.when('/showCharInfo/:personName', {
							title: 'Szczegóły rekordu',
							templateUrl: 'charInfo.html',
							controller: 'people'
						})
						.when('/test', {
							title: 'test',
							templateUrl: 'test.html',
							controller: 'DemoCtrl'
						})
						.otherwise({
							title: 'Lista osób',
							templateUrl: 'charList.html',
							controller: 'people'
						})
		}])
		.run(['$location', '$rootScope', function($location, $rootScope) {
				$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

					if (current.hasOwnProperty('$$route')) {

						$rootScope.title = current.$$route.title;
					}
				})
		}]);
 
 
			function people($scope, $http, $routeParams){
				$scope.people;
				$scope.person_name = $routeParams.personName;
				
				this.getPeople = function() {
					  $http({
						  
						  method: 'GET',    
						  url: 'db/get.php'
						  
					  }).then(function (response) {
						  
						  // on success
						  $scope.people = response.data;
						  
						  console.log($scope.people)
						  
					  }, function (response) {
						  
						  // on error
						  console.log(response.data,response.status);
						  
					  });
				};
				
				this.deletePerson = function( id ) {

					  $http({
						  
						  method: 'POST',
						  url:  'db/delete.php',
						  data: { recordId : id }
						  
					  }).then(function (response) {
					
						  $scope.getPeople();
					
					  }, function (response) {
						  
						  console.log(response.data,response.status);
						  
					  });
				};
				
				this.getPeople();
			}
			
			function PanelGroupsCtrl($mdPanel) {
				this.settings = {
				  name: 'settings',
				  items: [
					'Home',
					'About',
					'Contact'
				  ]
				};
				this.more = {
				  name: 'more',
				  items: [
					'Account',
					'Sign Out'
				  ]
				};
				this.tools = {
				  name: 'tools',
				  items: [
					'Create',
					'Delete'
				  ]
				};
				this.code = {
				  name: 'code',
				  items: [
					'See Source',
					'See Commits'
				  ]
				};

				this.menuTemplate = '' +
					'<div class="menu-panel" md-whiteframe="4">' +
					'  <div class="menu-content">' +
					'    <div class="menu-item" ng-repeat="item in ctrl.items">' +
					'      <button class="md-button">' +
					'        <span>{{item}}</span>' +
					'      </button>' +
					'    </div>' +
					'    <md-divider></md-divider>' +
					'    <div class="menu-item">' +
					'      <button class="md-button" ng-click="ctrl.closeMenu()">' +
					'        <span>Close Menu</span>' +
					'      </button>' +
					'    </div>' +
					'  </div>' +
					'</div>';

				$mdPanel.newPanelGroup('toolbar', {
				  maxOpen: 1
				});

				$mdPanel.newPanelGroup('menus', {
				  maxOpen: 1
				});

				this.showToolbarMenu = function($event, menu) {
				  var template = this.menuTemplate;

				  var position = $mdPanel.newPanelPosition()
					  .relativeTo($event.srcElement)
					  .addPanelPosition(
						$mdPanel.xPosition.ALIGN_START,
						$mdPanel.yPosition.BELOW
					  );

				  var config = {
					id: 'toolbar_' + menu.name,
					attachTo: angular.element(document.body),
					controller: PanelMenuCtrl,
					controllerAs: 'ctrl',
					template: template,
					position: position,
					panelClass: 'menu-panel-container',
					locals: {
					  items: menu.items
					},
					openFrom: $event,
					focusOnOpen: false,
					zIndex: 100,
					propagateContainerEvents: true,
					groupName: ['toolbar', 'menus']
				  };

				  $mdPanel.open(config);
				};

				this.showContentMenu = function($event, menu) {
				  var template = this.menuTemplate;

				  var position = $mdPanel.newPanelPosition()
					  .relativeTo($event.srcElement)
					  .addPanelPosition(
						$mdPanel.xPosition.ALIGN_START,
						$mdPanel.yPosition.BELOW
					  );

				  var config = {
					id: 'content_' + menu.name,
					attachTo: angular.element(document.body),
					controller: PanelMenuCtrl,
					controllerAs: 'ctrl',
					template: template,
					position: position,
					panelClass: 'menu-panel-container',
					locals: {
					  items: menu.items
					},
					openFrom: $event,
					focusOnOpen: false,
					zIndex: 100,
					propagateContainerEvents: true,
					groupName: 'menus'
				  };

				  $mdPanel.open(config);
				};
			  };

			  function PanelMenuCtrl(mdPanelRef) {
				this.closeMenu = function() {
				  mdPanelRef && mdPanelRef.close();
				}
			  };
			  
			  
			function AppCtrl($scope, $mdDialog) {
				  $scope.status = '  ';
				  $scope.customFullscreen = false;

				  $scope.showPrompt = function(ev,n) {
					// Appending dialog to document.body to cover sidenav in docs app
					var confirm = $mdDialog.prompt()
					  .title('What would you name your dog?')
					  .textContent('Bowser is a common name.')
					  .placeholder('Dog name')
					  .ariaLabel('Dog name')
					  .initialValue(n)
					  .initialValue()
					  .targetEvent(ev)
					  .ok('Okay!')
					  .cancel('I\'m a cat person');

					$mdDialog.show(confirm).then(function(result) {
					  $scope.status = 'You decided to name your dog ' + result + '.';
					}, function() {
					  $scope.status = 'You didn\'t name your dog.';
					});
				  };

				  $scope.showAdvanced = function(ev) {
					$mdDialog.show({
					  controller: DialogController,
					  templateUrl: 'dialog1.tmpl.html',
					  parent: angular.element(document.body),
					  targetEvent: ev,
					  clickOutsideToClose:true,
					  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
					})
					.then(function(answer) {
					  $scope.status = 'You said the information was "' + answer + '".';
					}, function() {
					  $scope.status = 'You cancelled the dialog.';
					});
				  };

				  $scope.showTabDialog = function(ev) {
					$mdDialog.show({
					  controller: DialogController,
					  templateUrl: 'tabDialog.tmpl.html',
					  parent: angular.element(document.body),
					  targetEvent: ev,
					  clickOutsideToClose:true
					})
						.then(function(answer) {
						  $scope.status = 'You said the information was "' + answer + '".';
						}, function() {
						  $scope.status = 'You cancelled the dialog.';
						});
				  };

				  $scope.showPrerenderedDialog = function(ev) {
					$mdDialog.show({
					  contentElement: '#myDialog',
					  parent: angular.element(document.body),
					  targetEvent: ev,
					  clickOutsideToClose: true
					});
				  };

				function DialogController($scope, $mdDialog) {
					$scope.hide = function() {
					  $mdDialog.hide();
					};

					$scope.cancel = function() {
					  $mdDialog.cancel();
					};

					$scope.answer = function(answer) {
					  $mdDialog.hide(answer);
					};
				}
			};
				
				function DemoCtrl($scope, $mdDialog, $mdMedia) {
					$scope.status = '  ';
					var questList = this;
					questList.allsQ = [];
					questList.openDialog = function($event) {
					  $mdDialog.show({
						controller: function ($timeout, $q, $scope, $mdDialog) {
								var questList =this;
								$scope.cancel = function($event) {
								$mdDialog.cancel();
								};
								$scope.finish = function($event) {
								$mdDialog.hide();
								};
								$scope.answer = function(answer) {
								$mdDialog.hide(answer);
								};
								},
						controllerAs: 'questList',
						templateUrl: 'dialog.tmpl.html',
						parent: angular.element(document.body),
						targetEvent: $event,
						clickOutsideToClose:true,
						locals: {parent: $scope},
					  })
					 .then(function(answer) {  
						console.log("answer")
						console.log(answer)
					  questList.allsQ.push({
						 tytul: answer.tytul ,
						 data: answer.data,
						 opis: answer.opis
					  });
					  questList.tytul = '';
					  questList.data = '';
					  questList.opis = '';
					  console.log(questList.allsQ);
					  console.log(questList.allsQ.length);
					});
					};
				};
			
})();