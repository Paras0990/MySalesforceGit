/**
* @File Name : autoRefreshGetTodayCasesController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : May 27, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | May 27, 2025 |   | Initial Version
**/

public class autoRefreshGetTodayCasesController {
	@AuraEnabled(cacheable=true)
	public static List<Case> getTodayCases(){
		return [SELECT Id,Subject,CaseNumber
				FROM Case
				WHERE CreatedDate =TODAY
				ORDER BY CreatedDate 
				DESC];
	}
}