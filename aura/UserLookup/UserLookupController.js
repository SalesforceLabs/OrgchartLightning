({
    findUser:function(component, event, helper) {
        var searchString = component.find("searchInput").get("v.value");
        console.log('searchString***' +searchString);
        if(searchString && searchString.length > 4){
            helper.searchUsers(component, event, helper);
        }else{
            component.set('v.searchResults',[]);
        }
        
        console.log('searchResults***' +component.get('v.searchResults'));
    },
    highlightSearch:function(component, event, helper) {
        component.set('v.searchWidth','90%');
        component.set('v.searchPadding','0%');
    },
    unhighlightSearch:function(component, event, helper) {
       component.set('v.searchWidth','auto');
       component.set('v.searchResults',[]);
    },
    fireUserDetailsEvt : function(component, event, helper) {
        var index = event.target.dataset.index;
        component.set("v.searchResults",[]);
        component.find("searchInput").set("v.value","");
        var compEvent = component.getEvent("userDetailsCmpEvent");
        console.log('event.currentTarget.dataset.placeid***'+ event.currentTarget.dataset.placeid);
        var selectedUserId = event.currentTarget.dataset.placeid;
        component.set('v.searchWidth','auto');
        component.set('v.searchResults',[]);
        compEvent.setParam("selUserId", selectedUserId);
        compEvent.fire();	
    }
    
})