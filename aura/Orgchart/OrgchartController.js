({
    doInit : function(component, event, helper) {
        var userId=$A.get("$SObjectType.CurrentUser.Id");		
        component.set('v.selectedUserId',userId)
        component.set('v.loginUserId',userId)
        console.log(navigator.appVersion);
        helper.getChartData(component, event,component.get('v.selectedUserId'), true);
    },
    handleSelect: function (component, event, helper) {
        // This will contain the string of the "value" attribute of the selected
        // lightning:menuItem
        var selectedMenuItemValue = event.getParam("value");
        if(selectedMenuItemValue == 'exportCSV')
        {
            helper.exportJSONtoCSV(component,event,helper);
        }
    },
    handleTouchMove: function(component, event, helper) {
        event.preventDefault();
    },
    onRender: function(component, event, helper) {
        component.set("v.divHeight", window.screen.height);
        
        var obj = document.getElementById("bodyId");
        
        if(obj){
            console.log(document.getElementById("bodyId").clientWidth);
            var wid = document.getElementById("bodyId").clientWidth;
            
            if(wid<800){
                component.set("v.placeHolder", 'Mobile'); 
                console.log('Mobile');
            }
            else
            {
                component.set("v.placeHolder", 'Desktop'); 
                console.log('Desktop');
            }
        }
        
        setTimeout(function() { 
            var scroller = component.find("managerScroll1");
            if(scroller){
            scroller.scrollTo("bottom"); 
            }
        },500);
    },
    loadJquery : function(component, event, helper) {
        
        
        //setTimeout(function() { 
        // var scroller = component.find("managerScroll1");
        // scroller.scrollTo("bottom"); 
        //},500);
    },
    searchById: function(component, event, helper) {
        //For Display Modal, Set the "openModal" attribute to "true"
        helper.getChartData(component, event, component.get('v.searchId'), false);
    },
    handleOpenModal: function(component, event, helper) {
        //For Display Modal, Set the "openModal" attribute to "true"
        component.set("v.componentID",1);
        component.set("v.openModal", true);
    },
    handleCloseModal: function(component, event, helper) {
        //For Close Modal, Set the "openModal" attribute to "fasle"  
        component.set("v.componentID",0);
        component.set("v.openModal", false);
    },
    renderView : function(component, event, helper) {
        component.set('v.selectedUserId',event.currentTarget.dataset.userid);
        component.set("v.componentID",0);
        component.set("v.openModal", false);
        helper.getChartData(component, event, component.get('v.selectedUserId'), false);
        setTimeout(function() { 
            var scroller = component.find("managerScroll1");
            if(scroller){
            scroller.scrollTo("bottom");
            }
        },1000);
        
        
    },
    nextPeer : function(component, event, helper) {
        var chartDataPeers = component.get('v.chartData');
        var index = chartDataPeers.peers.findIndex(function(item, i){
            return item.Id === chartDataPeers.selectedUser.Id
        });
        var length = chartDataPeers.peers.length;
        var placeId = "prevPeer_"+event.getSource().get("v.value");
        //alert(placeId);
        component.find(placeId).set("v.class","arrow-icon");
        component.set("v.prevDisabled", "false");
        
        if(index < length-1)
        {
            chartDataPeers.selectedUser = chartDataPeers.peers[index+1];
            component.set('v.chartData', chartDataPeers);
            helper.getReporteesData(component, event, chartDataPeers.selectedUser.Id );
        }
        if(index+1 == length-1)
        {
            component.set('v.right-icon-color', "icon-color");
            component.set("v.nextDisabled", "true");
            event.getSource().set("v.class","icon-color");
        }
    },
    handleUserDetails : function(component, event, helper) {
        //alert(event.getParam("selUserId"));
        helper.getChartData(component, event, event.getParam("selUserId"), false);
        setTimeout(function() { 
            var scroller = component.find("managerScroll1");
            if(scroller){
            scroller.scrollTo("bottom"); 
            }
        },1000);
        
        
    },
    previousPeer : function(component, event, helper) {
        var chartDataPeers = component.get('v.chartData');
        var index = chartDataPeers.peers.findIndex(function(item, i){
            return item.Id === chartDataPeers.selectedUser.Id
        });
        var placeId = "nextPeer_"+event.getSource().get("v.value");
        
        component.find(placeId).set("v.class","arrow-icon");
        component.set("v.nextDisabled", "false");
        
        if(index > 0)
        {
            chartDataPeers.selectedUser = chartDataPeers.peers[index-1];
            component.set('v.chartData', chartDataPeers);
            helper.getReporteesData(component, event, chartDataPeers.selectedUser.Id );
        }
        if(index-1 == 0)
        {
            component.set("v.prevDisabled", "true");
            event.getSource().set("v.class","icon-color");
        }
    },
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 
    },
    
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);
    },
   exportCSV: function(component,event,helper)
    {
    	helper.exportJSONtoCSV(component,event,helper);
	}
   /*  exportPDF: function(component,event,helper)
    {
    	helper.exportJSONtoPDF(component,event,helper);
	}*/
    
    
})