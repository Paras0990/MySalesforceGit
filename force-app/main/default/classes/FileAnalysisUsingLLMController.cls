/**
* @File Name : FileAnalysisUsingLLMController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : August 29, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | August 29, 2025 |   | Initial Version
**/

public class FileAnalysisUsingLLMController {
	@AuraEnabled
	public static String getContentVersionToString(Id documentId){
		ContentVersion cv=[SELECT VersionData
							FROM ContentVersion
							WHERE ContentDocumentId  =: documentId
							ORDER BY CreatedDate DESC
							LIMIT 1];
		return EncodingUtil.base64Encode(cv.VersionData);
	}


	@AuraEnabled
	public static String llmAnalysis(String docName, String fileBase64 ,String instructions){

		Http http=new Http();
		
		String apiKey='AIzaSyDloxvFTQssRi1E_GnYs-MqJhxUZsy-fz4';
		String endpoint='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

		HttpRequest request=new HttpRequest();
		request.setEndpoint(endpoint);
        request.setHeader('Content-Type', 'application/json');
		request.setMethod('POST');

		Map<String, Object> payload = new Map<String, Object>();
    	List<Object> contents = new List<Object>();
    	Map<String, Object> contentObj = new Map<String, Object>();
    	List<Object> parts = new List<Object>();

    	if (String.isNotBlank(fileBase64)) {
        Map<String, Object> inlineData = new Map<String, Object>();
        inlineData.put('mimeType', 'application/pdf'); // change if needed
        inlineData.put('data', fileBase64);

        Map<String, Object> inlineDataWrapper = new Map<String, Object>();
        inlineDataWrapper.put('inlineData', inlineData);

        parts.add(inlineDataWrapper);
    	}

    	
    	Map<String, Object> textPart = new Map<String, Object>();
    	textPart.put('text', instructions);
    	parts.add(textPart);

    	contentObj.put('parts', parts);
    	contents.add(contentObj);
    	payload.put('contents', contents);

    	String body = JSON.serialize(payload);
    	request.setBody(body);
		//request.setBody(fileBase64 + instructions);
		

		HttpResponse response=http.send(request);
		if (response.getStatusCode() == 200) {
        System.debug('Response: ' + response.getBody());
		Map<String, Object> resultDeserialized = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
		System.debug('Result Deserialized:'+resultDeserialized);
        List<Object>candidates=(List<Object>) resultDeserialized.get('candidates');
		System.debug('Candidates:'+candidates);

		Map<String, Object> firstCandidate = (Map<String, Object>) candidates[0];
        System.debug(' firstCandidate: ' + firstCandidate);

		Map<String,Object> content =(Map<String,Object>)firstCandidate.get('content');
		 System.debug(' Content: ' + content);

		 List<Object> responsePart = (List<Object>) content.get('parts');
		 System.debug(' Parts: ' + responsePart);


		 if (!responsePart.isEmpty()) {
            Map<String, Object> firstPart = (Map<String, Object>) responsePart[0];
            
            if (firstPart.containsKey('text')) {
                String textSummary = (String) firstPart.get('text');
                System.debug(' Extracted Summary: ' + textSummary);
                return textSummary;
            }
        }
		return 'No summary available';
       //return response.getBody();
    	} 
		else {
        System.debug('Error: ' + response.getStatusCode() + ' ' + response.getBody());
        return 'Error: ' + response.getStatusCode() + ' ' + response.getBody();
        }
	}
}