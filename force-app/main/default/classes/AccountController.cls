public class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAcounts(String inputIndustry){
        return[SELECT Id,Name,Industry,Rating 
        FROM Account
        WHERE Industry=:inputIndustry
        WITH USER_MODE];
    }

    @AuraEnabled
    public Static String updateAccounts(String recordId, String acccity){
        Account ac=new Account(Id=recordId,	City__c=acccity);
        try{
            update ac;
            return 'Account Update Successfull';
        }catch(Exception ex){
            return ex.getMessage();
        }   
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccounts(){
        return [SELECT Id,Name
                FROM Account 
                WITH USER_MODE];
    }

    @AuraEnabled
    public static List<Opportunity> getAccountRelatedOpportunities(String accId){
        return [SELECT Id,Name,StageName,CloseDate,Amount
                FROM Opportunity
                WHERE AccountId =: accId];

    }

    @AuraEnabled
    public static Id createNewOpp(String oppName, String stage, Date closeDt, Decimal amount ,Id accountId){
        Opportunity opp=new Opportunity();
        opp.Name=oppName;
        opp.AccountId=accountId;
        opp.StageName=stage;
        opp.CloseDate=closeDt;
        opp.Amount=amount;
    
        insert opp;

        return opp.Id;
    }

}