/**
* @File Name : caseHierarchyController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : May 20, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | May 20, 2025 |   | Initial Version
**/

public class caseHierarchyController {
	@AuraEnabled(cacheable=true)
	public static List<Case> getChildCases(String recordId){
		return [SELECT Id,CaseNumber, Subject,Origin FROM Case WHERE ParentId =:recordId];
	}
}