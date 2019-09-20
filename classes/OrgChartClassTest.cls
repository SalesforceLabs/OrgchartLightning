@isTest(seeAllData=false)
public class OrgChartClassTest {
	@TestSetup
    public static void createUsers(){
        
    }
    
    static testmethod void testOrgChart(){
        
        system.assertEquals(OrgChartClass.getOrgchartData(UserInfo.getUserId()).selectedUser.Id, (Id)UserInfo.getUserId());
        system.assertEquals(OrgChartClass.getReporteesData(UserInfo.getUserId()).selectedUser, null);
        system.assertEquals(OrgChartClass.performSearch('((($%^&').size(), 0);
        system.assert(OrgChartClass.getManagerHierarchy(UserInfo.getUserId()).size() > 0);
    }
}