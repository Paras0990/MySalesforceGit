/**
* @File Name : GenerateEmailDraftsAgentAPIController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : November 20, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 20, 2025 |   | Initial Version
**/

public class GenerateEmailDraftsAgentAPIController {
	@AuraEnabled
	public static String generateEmailText(String promptString){
		//String accessToken='Bearer eyJ0bmsiOiJjb3JlL3Byb2QvMDBERDcwMDAwMDBvNDJ2TUFBIiwidmVyIjoiMS4wIiwia2lkIjoiQ09SRV9BVEpXVC4wMERENzAwMDAwMG80MnYuMTc2MDg1MDQ5MTIyMCIsInR0eSI6InNmZGMtY29yZS10b2tlbiIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzY3AiOiJzZmFwX2FwaSBjaGF0Ym90X2FwaSBhcGkiLCJzdWIiOiJ1aWQ6MDA1RDcwMDAwMEdRZkNTSUExIiwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL3BhcmFzbWVocmEtMjMxMDEwLTI2OC1kZW1vLS1kZXZzYW5kYm94LnNhbmRib3gubXkuc2FsZXNmb3JjZS5jb20iLCJjbGllbnRfaWQiOiIzTVZHOUE2TW0wckpmVElpSEVHa2FmZzh2bGplRkd2b1MuQkR4aTFfX1dnOURQNUFtWEhCZ04weE92YTNtbEZmMmptSVFkQVlya3QxMkNxMVRpNUJWIiwiYXVkIjpbImh0dHBzOi8vYXBpLnNhbGVzZm9yY2UuY29tIiwiaHR0cHM6Ly9wYXJhc21laHJhLTIzMTAxMC0yNjgtZGVtby0tZGV2c2FuZGJveC5zYW5kYm94Lm15LnNhbGVzZm9yY2UuY29tIl0sIm5iZiI6MTc2MzY0NDc3NSwibXR5Ijoib2F1dGgiLCJzZmFwX3JoIjoiYm90LXN2Yy1sbG06YXdzLXByb2QxLXVzZWFzdDEvZWluc3RlaW4sZWluc3RlaW4tdHJhbnNjcmliZS9FaW5zdGVpbkdQVDphd3MtcHJvZDEtdXNlYXN0MS9laW5zdGVpbixlaW5zdGVpbi1haS1nYXRld2F5L0VpbnN0ZWluR1BUOmF3cy1wcm9kMS11c2Vhc3QxL2VpbnN0ZWluLGJvdC1zdmMtYXBpOmF3cy1wcm9kMS11c2Vhc3QxL3VlbmdhZ2UxIiwic2ZpIjoiMDJhZjIwZDA5MDRiMDNmNDlmMTQzNjI4YjU2NGQ0N2FkMjM1Njk0ZDU3ZjhmYjgwM2Q3ZDhlNmRhZDA1NDk5MyIsInNmYXBfb3AiOiJFaW5zdGVpbkhhd2tpbmdDMkNFbmFibGVkLEVHcHRGb3JEZXZzQXZhaWxhYmxlLEVpbnN0ZWluR2VuZXJhdGl2ZVNlcnZpY2UsVGFibGVhdU1ldHJpY0Jhc2ljcyxFaW5zdGVpbkdQVE5DUCxNQ1BTZXJ2aWNlIiwiaHNjIjpmYWxzZSwiZXhwIjoxNzYzNjQ2NTkwLCJpYXQiOjE3NjM2NDQ3OTB9.L4eZhG3CVVlKYysxu7jAIgMrBxRel8g8LjSx8xZL8jvp7a3l7E_mJH0F0dVLvnQfp17cx2__u-DKjKJGUv9b84VTS5vls4TD1D-212WVlbE7-KiiQba79zI14RihVHQbszzqSSUVKZ-B33Gzw8kpe2jpzm6zcksnTXF8zzbDoqg6Gd5xVhKrNu1LTA5LGT-Rbe0Db6EzVD2hvMvjm-nJvELrBiv6l9xno_CLDh_MwKjPp8qlrngjoU19WCd9GHZCv1vkGxZ0YZGQFhaOq6ECmeZN7d4ieuiKk_2DG7FVL3cG7A700ItQNWJYIj7l4-AMD27LiR4uuy38ZZaGorEQCg';
		Http http=new Http();

		HttpRequest req=new HttpRequest();
		req.setEndpoint('callout:GenerateEmailNamedCred');
		req.setMethod('POST');
		//req.setHeader('Authorization', accessToken);
		req.setHeader('Content-Type', 'application/json');
		req.setHeader('x-sfdc-app-context', 'EinsteinGPT');
		req.setHeader('x-client-feature-id', 'ai-platform-models-connected-app');

		Map<String, Object> body = new Map<String, Object>{
			'prompt' => promptString
		};
		req.setBody(JSON.serialize(body));
		
		System.Debug('Body: '+JSON.serialize(body));

		HttpResponse res=http.send(req);

			System.debug('Status: '+res.getStatus());
			System.debug('Status: '+res.getStatusCode());

			if(res.getStatusCode()==200){
				System.debug('Result: '+res.getBody());

				Map<String,Object> result=(Map<String,Object>)JSON.DeserializeUntyped(res.getBody());
				System.Debug('Deserialized Result:- '+result);
				System.Debug('Generation: '+result.get('generation'));

				Map<String, Object> generation = (Map<String, Object>) result.get('generation');

				String generatedText = (String) generation.get('generatedText');
				System.Debug('Generated Text: '+generatedText);

				return generatedText;
				
			}
			
		

		return 'No response from API';
		}

		@AuraEnabled
		public static Id saveDraftRecords(String prompt,String draftedEmail){
			if (String.isBlank(prompt) || String.isBlank(draftedEmail)) {
				throw new AuraHandledException('Prompt and Draft Email text are required.');
			}

			Email_Draft__c eDraft=new Email_Draft__c();
			eDraft.Prompt__c=prompt;
			eDraft.Draft_Text__c=draftedEmail;
			eDraft.Status__c='Draft';

			insert eDraft;

			return eDraft.Id;

		}

		@AuraEnabled(Cacheable=true)
			public static List<Email_Draft__c> getEmailDrafts(){
				return [SELECT Id,Name,Status__c,Prompt__c,Draft_Text__c
						FROM Email_Draft__c ];
			}

		@AuraEnabled
		public static Email_Draft__c submitForApproval(Id draftId){
			Email_Draft__c edraft=[Select Id,Name,Status__c 
								   FROM Email_Draft__c
								   WHERE Id=:draftId 
								   LIMIT 1];
			
			if(edraft.Status__c=='Draft'){
				edraft.Status__c='Pending Approval';
				update edraft;
			}


			return edraft;
		}

		@AuraEnabled(cacheable=true)
		public static Email_Draft__c isDraftUsable(String edraftId){
			if(!String.isBlank(edraftId)){
				return [Select Id,Name,Status__c,Prompt__c,Draft_Text__c
						FROM Email_Draft__c 
						WHERE Id =:edraftId];
			}
			return null;
		}

		@AuraEnabled(cacheable=true)
		public static String getUserEmail(Id userId){
			User u= [SELECT Id,Email
					FROM User
					WHERE Id =:userId];

			return u.Email;
		}

		@AuraEnabled
		public static Boolean sendEmail(List<String> toAddresses, String subject, String body ){
			Messaging.SingleEmailMessage message=new Messaging.SingleEmailMessage();
			//message.setOrgWideEmailAddressId=fromAddress;
			message.toAddresses=toAddresses;
			message.subject=subject;
			message.plainTextBody=body;

			Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { message });

			if (!results[0].isSuccess()) {
				throw new AuraHandledException('Email failed to send: ' + results[0].getErrors()[0].getMessage());
				
			}

			return true;

		}
		
}