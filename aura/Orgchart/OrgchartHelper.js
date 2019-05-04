({
    getChartData : function(component, event, userId, reporteesManager) {
        var action = component.get('c.getOrgchartData');
        if(userId){
            action.setParams({
                'userId': userId
            });
        }
        action.setCallback(this, function(res){
            var state = res.getState();
            if(state === 'SUCCESS'){
                var rVal = res.getReturnValue();
                console.log(rVal);
                component.set('v.chartData', rVal);
                component.set('v.reporteesData', rVal);
                component.set('v.allReportees', rVal.reports);
                
                component.set('v.allManagers', rVal.managers);
                
                component.set('v.initialReportees', rVal.reports.slice(0,7));
                console.log(rVal.reports.slice(7,rVal.reports.length-1)); 
                
                if(rVal.reports.length>7)
                {
                    component.set('v.isMoreReportees', true);
                    component.set('v.moreReporteesCount', rVal.reports.length-7);
                }
                else
                {
                    component.set('v.isMoreReportees', false);
                }
                component.set('v.moreReportees', rVal.reports.slice(7,rVal.reports.length-1));
                if(rVal.peers){
                    var selUserIdx = rVal.peers.findIndex((element) => {
                        return element.Id == rVal.selectedUser.Id;
                    });
                    component.set('v.selectedUserIdx', selUserIdx);
                }
            }else if(state === 'ERROR'){
                var errors = res.getError();
                var errorMsg;
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        errorMsg = errors[0].message;
                    }
                } else {
                    errorMsg = "An Unknown error occured."
                }
                console.log("Error message: " + errorMsg);
            }else{
                console.log(state);
            }
        });
        $A.enqueueAction(action);
        
    },
    
    
    getReporteesData : function(component, event, managerId) {
        var action = component.get('c.getReporteesData');
        //alert(managerId)
        if(managerId){
            action.setParams({
                'managerId': managerId
            });
        }
        action.setCallback(this, function(res){
            var state = res.getState();
            if(state === 'SUCCESS'){
                var rVal = res.getReturnValue();
                console.log(rVal);
                component.set('v.reporteesData', rVal);
                component.set('v.allReportees', rVal.reports);
                component.set('v.initialReportees', rVal.reports.slice(0,7));
                
                if(rVal.reports.length>7)
                {
                    component.set('v.isMoreReportees', true);
                    component.set('v.moreReporteesCount', rVal.reports.length-7);
                }
                else
                {
                    component.set('v.isMoreReportees', false);
                }
                component.set('v.moreReportees', rVal.reports.slice(7,rVal.reports.length-1));
                
            }else if(state === 'ERROR'){
                var errors = res.getError();
                var errorMsg;
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        errorMsg = errors[0].message;
                    }
                } else {
                    errorMsg = "An Unknown error occured."
                }
                console.log("Error message: " + errorMsg);
            }else{
                console.log(state);
            }
        });
        $A.enqueueAction(action);
    },
   exportJSONtoCSV:function(component,event,helper)
    {
        var currentUser = component.get('v.chartData');
        console.log(currentUser.selectedUser);
        var reporteeData=component.get('v.allReportees');
        //reporteeData= JSON.stringify(reporteeData);
         reporteeData = JSON.stringify(reporteeData, function (key, value) {return (value == undefined) ? "" : value});
        var reportees = typeof reporteeData != 'object' ? JSON.parse(reporteeData) : reporteeData;
        var ShowLabel='true';
        var CSV = '';    
        CSV += 'Org Chart' + '\r\n';
        if (ShowLabel) {
            var row = "";     
            row += 'Name,Title,Phone,Email,Relation';
            CSV += row + '\r\n';
            row = '"'+currentUser.selectedUser.Name+'","'+currentUser.selectedUser.Title+'","'+currentUser.selectedUser.Phone+'","'+currentUser.selectedUser.Email+'"';
            CSV += row + '\r\n';
            row = '"'+currentUser.selectedUser.Manager.Name+'","'+currentUser.selectedUser.Manager.Title+'","'+currentUser.selectedUser.Manager.Phone+'","'+currentUser.selectedUser.Manager.Email+'","Manager"';
            CSV += row + '\r\n';
        }
        for (var i = 0; i < reportees.length; i++) {     
            var row = "";
            row += '"' + reportees[i]['Name'] + '",'+'"' + reportees[i]['Title'] + '",'+'"' + reportees[i]['Phone'] + '",'+'"' + reportees[i]['Email'] + '","Reportee"';
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        for (var i = 0; i < currentUser.peers.length; i++) {     
            var row = "";
            row += '"' + currentUser.peers[i]['Name'] + '",'+'"' + currentUser.peers[i]['Title'] + '",'+'"' + currentUser.peers[i]['Phone'] + '",'+'"' + currentUser.peers[i]['Email'] + '","Peers"';
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        
        if (CSV == '') {        
            //alert("Invalid data");
            return;
        }   
        var fileName = "OrgChart";
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");    
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
   /*  exportJSONtoPDF:function(component,event,helper)
    {
        window.print();
    }*/
})