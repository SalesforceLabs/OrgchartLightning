public with sharing class OrgChartClass {
    public static List<User> reporteeHierarchy =new List<user>();
    
    @AuraEnabled
    public static OrgChartWrapper getOrgchartData(Id userId){
        
        userId = userId != null ? userId : userInfo.getUserId();
        OrgChartWrapper ocWrap = new OrgChartWrapper();
        
        List<User> selectedUser = [Select Id, Name, FirstName,Phone,Email,LastName, FullPhotoUrl, SmallPhotoUrl,
                                   UserRoleId, UserRole.Name, Title, ProfileId, 
                                   Manager.ManagerId, Manager.FirstName, Manager.LastName,ManagerId, 
                                   Manager.Name, Manager.FullPhotoUrl, Manager.smallPhotoUrl,Manager.Title,Manager.Phone,Manager.Email,
                                   Manager.Manager.ManagerId, Manager.Manager.FirstName, Manager.Manager.LastName,
                                   Manager.Manager.Name, Manager.Manager.FullPhotoUrl, Manager.Manager.smallPhotoUrl
                                   from User 
                                   where Id =:userId];
        
        
        ocWrap.selectedUser = selectedUser[0];
        ocWrap.peers = new List<User>([SELECT Id, Name, FirstName, LastName, UserRoleId,Phone,Email, UserRole.Name, Title, ProfileId, ManagerId, Manager.Name, FullPhotoUrl, SmallPhotoUrl
                                       FROM User 
                                       WHERE ManagerId =: selectedUser[0].ManagerId 
                                       AND ManagerId != null
                                       AND isActive = true
                                       ORDER BY Name ASC]);
        ocWrap.reports = new List<User>([SELECT Id, Name, FirstName, LastName,Phone,Email, UserRoleId, UserRole.Name, Title, ProfileId, ManagerId, Manager.Name, FullPhotoUrl, SmallPhotoUrl
                                         FROM User 
                                         WHERE ManagerId =: userId AND isActive = true
                                         ORDER BY Name ASC]);
        List<User> managerList= new List<User>();
        managerList=getManagerHierarchy(userId);
        
        managerList.remove(managerList.size()-1);
        ocWrap.managers = managerList;
        
        System.debug(ocWrap);
        return ocWrap;
    }
    
    @AuraEnabled
    public static OrgChartWrapper getReporteesData(Id managerId){
        OrgChartWrapper ocWrap = new OrgChartWrapper();
         ocWrap.reports = new List<User>([SELECT Id, Name, FirstName, LastName, UserRoleId, UserRole.Name, Title, ProfileId, ManagerId, Manager.Name, FullPhotoUrl, SmallPhotoUrl
                                         FROM User 
                                         WHERE ManagerId =: managerId AND isActive = true
                                         ORDER BY Name ASC]);
        return ocWrap;
    }
    
    @AuraEnabled
    public static List<User> performSearch(String searchString){
        String searchQuery = 'FIND \'' +searchString+ '\' RETURNING USER(ID, FIRSTNAME, LASTNAME, NAME)';
        List<List<sObject>> searchResult = new List<List<sObject>>(search.query(searchquery));
        List<User> userList;
        if(!searchResult.isEmpty()){
            userList = searchResult[0];
        }
        
        return userList;
    }
    
    @AuraEnabled
    public static List<User> getManagerHierarchy(Id userId){    
        User ur = new User();
        ur = [select Id, Name, ManagerId,FullPhotoUrl from User  where Id =: userId];
        if(ur.ManagerId != null){ 
            if(Limits.getQueries()<=Limits.getLimitQueries())
                getManagerHierarchy(ur.ManagerId);
        }
        reporteeHierarchy.add(ur);
        return reporteeHierarchy;
    }
    
    
    public class OrgChartWrapper{
        @AuraEnabled public User selectedUser;
        @AuraEnabled public List<User> peers;
        @AuraEnabled public List<User> reports;
        @AuraEnabled public List<User> managers;
        public OrgChartWrapper(){
            
        }
    }
}