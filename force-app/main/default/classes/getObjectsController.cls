/**
* @File Name : getObjectsController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : June 1, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | June 1, 2025 |   | Initial Version
**/

public class getObjectsController {
	@AuraEnabled(cacheable=true)
	public static List<EntityDefinition> getObjects(){
		return [SELECT Label,QualifiedApiName
				FROM EntityDefinition 
				WHERE IsQueryable = true
				AND IsCustomizable = true
				AND IsDeprecatedAndHidden = false
				AND IsEverCreatable = true
				AND IsEverUpdatable = true
				WITH USER_MODE
				ORDER BY Label
				];
	}

	@AuraEnabled(cacheable=true)
	public static List<FieldDefinition> getObjFields(String objLabel){
		return [SELECT Label, QualifiedApiName 
				FROM FieldDefinition 
				WHERE EntityDefinition.QualifiedApiName = : objLabel
				WITH USER_MODE
				LIMIT 100];
	}

	@AuraEnabled(cacheable=true)
	public static List<Account>getAccounts(String[] fields,String objAPIName){
		if (fields == null || fields.isEmpty()) {
        throw new IllegalArgumentException('Field list cannot be empty');
    }
			String fieldString = '';
			for (Integer i = 0; i < fields.size(); i++) {
				fieldString += fields[i];
				if (i < fields.size() - 1) {
					fieldString += ', ';
				}
			}
			String soql = 'SELECT ' + fieldString + ' FROM ' + objAPIName + ' ORDER BY CreatedDate DESC LIMIT 10';
			return Database.query(soql);
	}
	
}