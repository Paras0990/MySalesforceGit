import { LightningElement,wire } from 'lwc';
import generateEmailText from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.generateEmailText';
import saveDraftRecords from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.saveDraftRecords';
import submitForApproval from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.submitForApproval';

import { publish, MessageContext } from 'lightning/messageService';
import GENERATE_EMAIL_CHANNEL from '@salesforce/messageChannel/generateEmailMessagingChannel__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GenerateEmailUsingAgentforceLWC extends LightningElement {
    prompt;
    generatedEmail;
    displayEmailDraft=false;
    disableGenerateEmailButton=true;
    disableApprovalButton=true;
    disableSaveDraftButton=true;
    loading;
    saveDraftId;

    disableTextArea=false;
    promptText;


    handleInputChange(event){
        this.prompt=event.target.value;
        console.log("Prompt: ",this.prompt);
        if(this.prompt){
            this.disableGenerateEmailButton=false;
        }
    }

    async handleGenerateEmail(){
        this.loading=true;
        if(this.prompt){
            this.generatedEmail=await generateEmailText({promptString:this.prompt});
            console.log('Generated Email: ',this.generatedEmail);
            if(this.generatedEmail){
                this.loading=false;
                this.displayEmailDraft=true;
                this.disableSaveDraftButton=false;
                this.disableGenerateEmailButton=true;
                
            }
        }

    }

    @wire(MessageContext)
    messageContext;

    async handleSaveDraft(){
        this.loading=true;
        
        if(this.prompt && this.generatedEmail){
            this.saveDraftId=await saveDraftRecords({prompt:this.prompt ,draftedEmail:this.generatedEmail});
            console.log('Draft Created: ',this.saveDraftId);
        }

        if(this.saveDraftId){
            this.loading=false;
            this.disableApprovalButton=false;
            this.disableSaveDraftButton=true;
           
            this.disableTextArea=true;
            const payload={msg:'Successfull'};
            publish(this.messageContext, GENERATE_EMAIL_CHANNEL,payload);
        }
        
    }

    async handleSendForApproval(){
        console.log('<---Inside Send Approval--->');
        this.disableApprovalButton=true;
        let updateEdraft=await submitForApproval({draftId:this.saveDraftId});
        console.log('Updated Edraft: ',updateEdraft);

        if(updateEdraft){
            this.showToast();
            const payload={msg:'Successfull'};
            publish(this.messageContext, GENERATE_EMAIL_CHANNEL,payload);
            this.promptText='';
            this.disableTextArea=false;
            this.displayEmailDraft=false;
            this.disableGenerateEmailButton=false;
     }
    }

    showToast(){
        const event = new ShowToastEvent({
                    title: 'Success',
                    message:
                        'The Email Draft {0} has been successfully sent for approval! {1}',
                    variant:'success',
                    messageData: [
                        'Salesforce',
                        {
                            url: 'https://parasmehra-231010-268-demo--devsandbox.sandbox.my.salesforce.com/'+this.saveDraftId,
                            label: 'Check the Email Draft here',
                        },
                    ],
                });
                this.dispatchEvent(event);
            }

    
    




}