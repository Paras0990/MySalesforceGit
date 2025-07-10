/**
* @File Name : OppStageDragDropController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : July 8, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | July 8, 2025 |   | Initial Version
**/

public class OppStageDragDropController {
	@AuraEnabled(Cacheable=true)
	public static List<Opportunity> getAllProspectingOpps(String searchTerm){
		if(String.isBlank(searchTerm)){
			return [SELECT Id,Name,StageName 
					FROM Opportunity 
					WHERE StageName!='Closed-Won' 
					AND StageName!='Closed-Lost' 
					];
		}else{
			String key=searchTerm +'%';
			return [SELECT Id,Name,StageName
					FROM Opportunity
					WHERE StageName!='Closed-Won' AND StageName!='Closed-Lost' AND Name LIKE : key];
		}

		
	} 

    @AuraEnabled(Cacheable=true)
	public static List<Opportunity> getClosedWon(){
		return[
			SELECT Id,Name,StageName 
			FROM Opportunity 
			WHERE StageName='Closed-Won' 
		];
	}

	@AuraEnabled(Cacheable=true)
	public static List<Opportunity> getClosedLost(){
		return[
			SELECT Id,Name,StageName 
			FROM Opportunity 
			WHERE StageName='Closed-Lost' 
		];
	}

	@AuraEnabled
	public static Opportunity updateOpportunity(String oppId, String stageName){
		
		try{
			Opportunity opp=[SELECT Id,Name,StageName 
						 FROM Opportunity
						 WHERE Id=:oppId 
						 ];
		
			opp.StageName=stageName;
			update opp;
			return opp;
	       }
		catch(exception e){
			throw new AuraHandledException('Error updating Opportunity stage: ' + e.getMessage());
		}
	}

}