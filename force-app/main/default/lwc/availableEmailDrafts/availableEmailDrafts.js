import { LightningElement ,wire} from 'lwc';
import getEmailDrafts from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.getEmailDrafts';
import { refreshApex } from '@salesforce/apex';
import submitForApproval from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.submitForApproval';
import isDraftUsable from '@salesforce/apex/GenerateEmailDraftsAgentAPIController.isDraftUsable';  

import sendEmailModal from 'c/sendEmailModal';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import {
    subscribe,
    unsubscribe,
    MessageContext,
} from 'lightning/messageService';
import GENERATE_EMAIL_CHANNEL from '@salesforce/messageChannel/generateEmailMessagingChannel__c';

const actions = [
    { label: 'Use', name: 'use' },
    { label: 'Send for Approval', name: 'send_for_Approval' },
];

const columns = [
    {
        label: 'Draft Number',
        fieldName: 'recordLink',
        type: 'url',
        typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
    },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Prompt', fieldName: 'Prompt__c' },
    { label: 'Draft Text', fieldName: 'Draft_Text__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class AvailableEmailDrafts extends LightningElement {

    data;
    error;
    columns=columns;
    wiredResult;
    msg;
    loadDatatable=false;


    @wire(getEmailDrafts)
    wiredEmailDrafts(result){
        this.wiredResult=result;
        const { data, error } = result;
        if (data) {
            this.data = data.map(record => ({
                ...record,
                recordLink: '/' + record.Id
               
            }));
             console.log('Data; ',this.data);
        }
        else if(error){
            this.error=error;
            console.log('Error: ',this.error)
        }
    }

     @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
       
        if (!this.subscription) {
            
            this.subscription = subscribe(
                this.messageContext,GENERATE_EMAIL_CHANNEL,
                (message) => this.handleMessage(message),
               
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }


    async handleMessage(message) {
        
        this.msg = message.msg;
        console.log('Message:',this.msg);

        if(this.msg){
            this.loadDatatable=true;
            
            try{
                await refreshApex(this.wiredResult);
            }finally{
                this.loadDatatable=false;
            }
            

        }
    }

   
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'use':
                this.useDraft(row);
                break;
            case 'send_for_Approval':
                this.sendForApproval(row);
                break;
            default:
        }
    }

    async useDraft(row){
        let isUsable=await isDraftUsable({edraftId:row.Id});
        console.log('Selected Draft : ',isUsable);
         console.log('Selected Draft Status: ',isUsable.Status__c);

         if(isUsable.Status__c!='Approved'){
            console.log('Please get this Email Draft Approved before using.');
            this.showToast('Approval Required!','Please get this Email Draft Approved before using.','error');
         }
         else{
            console.log('Selected Draft Status: ',isUsable);
            console.log('Email Draft is ready to use');
             const result = await sendEmailModal.open({
            
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            emailDraftRecord:isUsable,
            
        }); 
        console.log('Result: ',result);


         }
        
    }

    async sendForApproval(row){
        console.log('<---Inside Send Approval--->');
        console.log('Row Id: ',row.Id);
        const currentStatus=row.Status__c;
        console.log('Current Status:',row.Status__c);

        let sendDraft=await submitForApproval({draftId:row.Id});
        console.log('Updated Draft: ',sendDraft);

        if (currentStatus === 'Pending Approval') {
        this.showToast(
            'Approval Pending Already!',
            'You cannot send the draft for Approval as this is already in Pending Approval status.',
            'warning'
        );
        } else if (sendDraft.Status__c === 'Pending Approval') {
            this.showToast(
                'Submitted for Approval!',
                'The draft has been successfully submitted for approval.',
                'success'
            );
        } else if (sendDraft.Status__c === 'Approved') {
            this.showToast(
                'Already Approved!',
                'This email draft is already approved and ready to use!',
                'warning'
            );
        } else if (sendDraft.Status__c === 'Rejected') {
            this.showToast(
                'Already Rejected!',
                'This email draft is rejected and cannot be used!',
                'warning'
            );
        }


      
    }

    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title ,
            message:message,
            variant:variant,
        });
        this.dispatchEvent(event);
    }





}