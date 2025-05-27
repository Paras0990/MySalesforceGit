import { LightningElement,wire } from "lwc";
import getTodayCases from '@salesforce/apex/autoRefreshGetTodayCasesController.getTodayCases';
import { refreshApex } from "@salesforce/apex";
import {
    subscribe,
    onError,
    setDebugFlag,
    isEmpEnabled,
} from 'lightning/empApi';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber'},
    { label: 'Subject', fieldName: 'Subject' },
];



export default class GetListRecords extends LightningElement {
  wiredResultcases;
  columns=columns;
  wiredResult;

  caseNumber;
  caseId;
  caseSubject;



  channelName = '/event/Case__e';
  subscription = {};

  @wire(getTodayCases)
  wiredCases(result){
    this.wiredResult=result;
    console.log('Wired Result:',this.wiredResult)
    if(result.data){
      console.log('Data:',result.data);
      this.cases=result.data;
       console.log('Cases:',this.cases);
    }
    else if(result.error){
      console.log('MyError:',result.error);
    }
  }




    // Initializes the component
    connectedCallback() {
        // Register error listener
        this.handleSubscribe();
        this.registerErrorListener();
    }

    // Handles subscribe button click
    handleSubscribe() {
       console.log('<----Inside handle Subscribe--->');
        // Callback invoked whenever a new event message is received
        const messageCallback =  (response) => {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received

            const payload=response.data.payload;
            console.log('Outside Subscribe Payload : ',payload);
            console.log(' Payload  Case Number: ',payload.CaseNumber__c);
            console.log('Payload Subject : ',payload.CaseSubject__c);
            console.log('Payload Case Id : ',payload.Case_Id__c);

            this.caseId=payload.Case_Id__c;
            this.caseNumber=payload.CaseNumber__c;
            this.caseSubject=payload.CaseSubject__c;

            console.log('Case Number: ',this.caseNumber);
            console.log('Subject : ',this.caseSubject);
            console.log('Case Id : ', this.caseId );

            this.handleRefresh();

        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            console.log(
                'Response: ',
                JSON.stringify(response)
            );

            console.log(JSON.stringify(response, null, 2));

            //this.handleRefresh();

            const payload=response.data.payload;
            console.log('Payload : ',payload);
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    handleRefresh(){
      console.log('<----Inside handle Refresh--->');
      refreshApex(this.wiredResult);
    }

    
}