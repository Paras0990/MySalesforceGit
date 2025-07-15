/**
* @File Name : TaskAssignementController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : July 14, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | July 14, 2025 |   | Initial Version
**/

public class TaskAssignementController {
	@AuraEnabled(cacheable=true)
	public static List<Task> getOpenTasks(){
		return [SELECT Id, OwnerId,Owner.Name,Subject, Status,Priority 
				FROM Task
				WHERE Status!='Completed'];
	}

	@AuraEnabled(cacheable=true)
	public static List<User> getAllUsers(){
		return [SELECT Id,Name
		 	 	FROM User WITH_USERMODE];
	}

	@AuraEnabled

	public static Task updateTaskRecord(String taskId, String userId){

		Task tk=[SELECT Id,Subject,OwnerId,Owner.Name FROM TASK WHERE Id=:taskId];
		tk.OwnerId=userId;

		update tk;

		return tk;


	}
}