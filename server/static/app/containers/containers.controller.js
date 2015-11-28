(function(){
    'use strict';

    angular
        .module('shipyard.containers')
        .controller('ContainersController', ContainersController);

    ContainersController.$inject = ['$scope', 'ContainerService', '$state'];
    function ContainersController($scope, ContainerService, $state) {
        var vm = this;
        
        vm.error = "";
        vm.errors = [];
        vm.containers = [];
        vm.selected = {};
        vm.selectedItemCount = 0;
        vm.selectedAll = false;
        vm.numOfInstances = 1;
        vm.selectedContainer = null;
        vm.selectedContainerId = "";
        vm.newName = "";

        vm.showDestroyContainerDialog = showDestroyContainerDialog;
        vm.showRestartContainerDialog = showRestartContainerDialog;
        vm.showStopContainerDialog = showStopContainerDialog;
        vm.showScaleContainerDialog = showScaleContainerDialog;
        vm.showRenameContainerDialog = showRenameContainerDialog;
        vm.destroyContainer = destroyContainer;
        vm.stopContainer = stopContainer;
        vm.restartContainer = restartContainer;
        vm.scaleContainer = scaleContainer;
        vm.renameContainer = renameContainer;
        vm.refresh = refresh;
        vm.containerStatusText = containerStatusText;
        vm.checkAll = checkAll;
        vm.clearAll = clearAll;
        vm.destroyAll = destroyAll;
        vm.stopAll = stopAll;
        vm.restartAll = restartAll;

        refresh();

        // Apply jQuery to dropdowns in table once ngRepeat has finished rendering
        $scope.$on('ngRepeatFinished', function() {
            $('.ui.sortable.celled.table').tablesort();
            $('#select-all-table-header').unbind();
            $('.ui.right.pointing.dropdown').dropdown();
        });

        $('#multi-action-menu').sidebar({dimPage: false, animation: 'overlay', transition: 'overlay'});

        $scope.$watch(function() {
            var count = 0;
            angular.forEach(vm.selected, function (s) {
                if(s.Selected) {
                    count += 1;
                }
            });
            vm.selectedItemCount = count;
        });

        // Remove selected items that are no longer visible 
        $scope.$watchCollection('filteredContainers', function () {
            angular.forEach(vm.selected, function(s) {
                if(vm.selected[s.Id].Selected == true) {
                    var isVisible = false
                    angular.forEach($scope.filteredContainers, function(c) {
                        if(c.Id == s.Id) {
                            isVisible = true;
                            return;
                        }
                    });
                    vm.selected[s.Id].Selected = isVisible;
                }
            });
            return;
        });

        function clearAll() {
            angular.forEach(vm.selected, function (s) {
                vm.selected[s.Id].Selected = false;
            });
        }

        function restartAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    ContainerService.restart(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function stopAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    ContainerService.stop(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function destroyAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    ContainerService.destroy(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function checkAll() {
            angular.forEach($scope.filteredContainers, function (container) {
                vm.selected[container.Id].Selected = vm.selectedAll;
            });
        }

        function refresh() {
            ContainerService.list()
                .then(function(data) {
                    vm.containers = data; 
                    angular.forEach(vm.containers, function (container) {
                        vm.selected[container.Id] = {Id: container.Id, Selected: vm.selectedAll};
                    });
                }, function(data) {
                    vm.error = data;
                });

            vm.error = "";
            vm.errors = [];
            vm.containers = [];
            vm.selected = {};
            vm.selectedItemCount = 0;
            vm.selectedAll = false;
            vm.numOfInstances = 1;
            vm.selectedContainerId = "";
            vm.newName = "";
        }

        function showDestroyContainerDialog(container) {
            vm.selectedContainerId = container.Id;
            $('#destroy-modal').modal('show');
        }

        function showRestartContainerDialog(container) {
            vm.selectedContainerId = container.Id;
            $('#restart-modal').modal('show');
        }

        function showStopContainerDialog(container) {
            vm.selectedContainerId = container.Id;
            $('#stop-modal').modal('show');
        }

        function showScaleContainerDialog(container) {
            vm.selectedContainerId = container.Id;
            $('#scale-modal').modal('show');
        }

        function showRenameContainerDialog(container) {
            vm.selectedContainer = container;
            $('#rename-modal').modal('show');
        }

        function destroyContainer() {
            ContainerService.destroy(vm.selectedContainerId)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function stopContainer() {
            ContainerService.stop(vm.selectedContainerId)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function restartContainer() {
            ContainerService.restart(vm.selectedContainerId)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function scaleContainer() {
            ContainerService.scale(vm.selectedContainerId, vm.numOfInstances)
                .then(function(response) {
                    vm.refresh();
                }, function(response) {
                    // Add unique errors to vm.errors
                    $.each(response.data.Errors, function(i, el){
                            if($.inArray(el, vm.errors) === -1) vm.errors.push(el);
                    });
                });
        }

        function renameContainer() {
            ContainerService.rename(vm.selectedContainer.Id, vm.newName)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function containerStatusText(container) {
            if(container.Status.indexOf("Up")==0){
                return "Running";
            }
            else if(container.Status.indexOf("Exited")==0){
                return "Stopped";
            }            
            return "Unknown";
        }   
    }
})();
