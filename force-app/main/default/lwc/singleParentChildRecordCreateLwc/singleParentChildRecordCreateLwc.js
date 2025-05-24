import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';


import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';


export default class SingleParentChildRecordCreateLwc extends NavigationMixin (LightningElement) {

    accName;
    accWebsite;

    conFirstname;
    conLastname;
    conEmail;
    conPhone;

    handleChange(event){
       const field=event.target.name;
       const value=event.target.value;
        console.log('Field:',field);
        console.log('Value:',value);

        if(field == 'accName'){
            this.accName=value;
            console.log('Change value:', this.accName);
        }
        else if(field == 'accWebsite'){
            this.accWebsite=value;
        }
        else if(field == 'conFirstname'){
            this.conFirstname=value;
        }
        else if(field == 'conLastname'){
            this.conLastname=value;
        }
        else if(field == 'conEmail'){
            this.conEmail=value;
        }
        else if(field == 'conPhone'){
            this.conPhone=value;
        }
       
    }

    async handleSave(event){
    console.log('<---Inside Save--->');
    const accfields = {};
    
    accfields[NAME_FIELD.fieldApiName] = this.accName;
    accfields[WEBSITE_FIELD.fieldApiName] = this.accWebsite;

    const confields={};

    confields[FIRSTNAME_FIELD.fieldApiName] = this.conFirstname;
    confields[LASTNAME_FIELD.fieldApiName] = this.conLastname;
    confields[EMAIL_FIELD.fieldApiName] = this.conEmail;
    confields[PHONE_FIELD.fieldApiName] = this.conPhone;
    


    const recordInputAccount = { apiName: ACCOUNT_OBJECT.objectApiName, fields:accfields };
    const recordInputContact = { apiName: CONTACT_OBJECT.objectApiName, fields:confields };
    const evtName=event.target.name;
    console.log('Event name:',evtName);
    
    try {
      // Invoke createRecord
      const account = await createRecord(recordInputAccount);
      confields['AccountId'] = account.id;
      const contact= await createRecord(recordInputContact);
      console.log('Con Id:',contact.id);
      const contactId=contact.id;

      console.log('Account:',account);
      console.log('Contact:',contact);
     
      console.log('Inside try Event name:',evtName);

      if(evtName === 'Save'){
        this.navigateToContactRecord(contactId);
      }
      else if(evtName === 'Save&New'){
        this.clearFields();
      }

      
    } catch (error) {
      // Handle error
    }

    }

    navigateToContactRecord(conId){
        console.log('<-- Inside Nav--> Con Id:',conId);
        this[NavigationMixin.Navigate]({
             type: 'standard__recordPage',
                attributes: {
                    recordId: conId,
                    objectApiName: 'Contact',
                    actionName: 'view',
                },
            });

    }

    handleSaveNew(event){
            console.log('<---Inside Save and New--->');
            this.handleSave(event);
    }

    handleCancel(){
        this.clearFields();
    }

    clearFields(){
        this.accName='';
        this.accWebsite='';
        this.conFirstname='';
        this.conLastname='';
        this.conEmail='';
        this.conPhone='';
    }

}