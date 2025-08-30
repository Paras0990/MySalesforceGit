public class WeatherInfoClass {
    @AuraEnabled
    public static Map<String, Object> getWeatherInfo(String city){
        Http http=new Http();
        String endpoint='https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=34d29e054ff46f4c763e30343b4f456f&units=metric';
        HttpRequest request=new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);
        System.debug('Response Status:'+response.getStatusCode());
        
        if(response.getStatusCode()== 200){
            System.debug('Response Body:'+response.getBody());
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.Debug(result);
            String CityName=(String) result.get('name');
            System.Debug('City: '+CityName);
            Map<String, Object> mainResult = (Map<String, Object>)result.get('main');
            System.Debug('Main: '+mainResult);
  
            
            return mainResult;
        }
        else if(response.getStatusCode()== 404){
            return new Map<String, Object>{'error'=>'Enter the correct City Name'};
         
        }
        return new Map<String, Object>{'error'=>'No Response from API'};
        
        
    }

}