({
	searchUsers : function(component, event, helper) {
		var action= component.get("c.performSearch");
        action.setParams({"searchString": component.find("searchInput").get("v.value")});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('users***' + JSON.stringify(response.getReturnValue()));
                component.set("v.searchResults", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	}
})