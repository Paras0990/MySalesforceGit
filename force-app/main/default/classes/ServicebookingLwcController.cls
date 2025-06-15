/**
* @File Name : ServicebookingLwcController.cls
* @Description : Controller for Service Booking conflicts checking.
* @Author :Paras Mehra
* @Last Modified By :May 14 ,2024
* @Last Modified On : June 14, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | June 14, 2025 |   | Initial Version
**/

public class ServicebookingLwcController {

	@AuraEnabled(cacheable=true)
	public Static List<User> getTechnicianUsers(String searchKey){
		if(!String.isBlank(searchKey)){
			String key=searchKey+'%';
			return[SELECT Id,Name,FirstName,LastName,CompanyName 
			   FROM USER
			   WHERE Name LIKE : key];
		}
		else {
			return new list<User>();
		}	
	}

	@AuraEnabled(cacheable=true)
	public static User getUser(Id userId){
		
		return [SELECT Id,Name 
				FROM User 
				WHERE Id =:userId];

	}

	@AuraEnabled
	public static Boolean isConflict(String userId, DateTime startDT ,Datetime endDT){
		List<Service_Booking__c> bookingList=[SELECT Id,Name,Technician__c, Technician__r.Name ,Start_DateTime__c,End_DateTime__c 
											  From Service_Booking__c 
											  Where Technician__c =:userId];

		System.Debug(startDT);
		
		for(Service_Booking__c sb:bookingList){
			if(
            (startDT >= sb.Start_DateTime__c && startDT < sb.End_DateTime__c) || 
            (endDT > sb.Start_DateTime__c && endDT <= sb.End_DateTime__c) ||
            (startDT <= sb.Start_DateTime__c && endDT >= sb.End_DateTime__c)
        ) {
            return true;  // conflict found
        }
    }
    return false;
	}

	@AuraEnabled
	public static Id createSBRecord(String userId,String name, DateTime startDT ,Datetime endDT){
		try {
        Service_Booking__c sbRecord = new Service_Booking__c();
        sbRecord.Name = name;
        sbRecord.Technician__c = userId;
        sbRecord.Start_DateTime__c = startDT;
        sbRecord.End_DateTime__c = endDT;

        insert sbRecord;
        return sbRecord.Id;

    } 
	catch (Exception e) {
        System.debug('Apex Error: ' + e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }

	}
}