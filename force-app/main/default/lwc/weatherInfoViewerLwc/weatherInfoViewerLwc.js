import { LightningElement,track } from 'lwc';
import getWeatherInfo from '@salesforce/apex/WeatherInfoClass.getWeatherInfo';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import weatherLogo from'@salesforce/resourceUrl/weatherLogo';


export default class WeatherInfoViewerLwc extends LightningElement {

city;
errorMsg;
weatherDetails=false;
@track weatherData;

svgURL = `${weatherLogo}#weatherLogo`;

handleChange(event){
    this.city=event.target.value;
    console.log('City: ',this.city);
}

async handleSubmit(){
    if(this.city != null){
         const weatherInfo=await getWeatherInfo({city: this.city});
         this.weatherData=weatherInfo;
         if(this.weatherData){
         this.weatherDetails=true;
    }
  
    console.log('API response:',weatherInfo);
    if(weatherInfo.error){
        this.weatherDetails=false;
        this.errorMsg=weatherInfo.error;
        const event = new ShowToastEvent({
            title: 'ERROR',
            message:
                this.errorMsg,
            variant:'error'
        });
        this.dispatchEvent(event);


    }


    }
   
}

handleClear(){
    this.city='';
    this.weatherDetails=false;

}

}