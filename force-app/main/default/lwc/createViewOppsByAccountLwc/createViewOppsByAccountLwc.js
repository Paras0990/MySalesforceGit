import { LightningElement,wire,track } from 'lwc';
import getAllAccounts from '@salesforce/apex/AccountController.getAllAccounts';
import getAccountRelatedOpportunities from '@salesforce/apex/AccountController.getAccountRelatedOpportunities';
import createNewOpp from '@salesforce/apex/AccountController.createNewOpp';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// import MyModal from 'c/modalOppCreateLWC';


const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Stage', fieldName: 'StageName' },
    { label: 'Close Date', fieldName: 'CloseDate' },
    { label: 'Amount', fieldName: 'Amount' }
];

export default class CreateViewOppsByAccountLwc extends LightningElement {
    options;
    displayOpps=false;
    @track oppData=[];

    selectedAccId;
    columns=columns;
    displayModal=false;

    accName;

    oppName;
    closeDate;
    stage;
    amount;

    isLoading=false;


    @wire(getAllAccounts)
    wiredAccounts({data,error}){
        if(data){
            console.log("Data:",data);
            this.options=data.map((currItem)=>{
            console.log("Current Item:",currItem);
            return{
                label: currItem.Name,
                value: currItem.Id

                }
                
            })
         console.log("Options:",this.options);
         console.log("Type of:",typeof(options));
         console.log("Length:",this.options.length);

         }
        else if(error){
            console.log("Error:",error);
        }
    }

    async handleChange(event){
        this.selectedAccId=event.target.value;
        for(let i=0;i<this.options.length;i++){
            if(this.options[i].value === this.selectedAccId){
                this.accName=this.options[i].label;
                console.log("Options value",this.options[i].value);
                console.log("Options Name", this.accName);

            }

        }
       
        console.log("Selected Acc:",this.selectedAccId);
        

        this.displayOpps=true;

        this.oppData=await getAccountRelatedOpportunities({accId:this.selectedAccId});
        console.log("OppData:",this.oppData);
        
    }

    handleCreateOpp(){
        this.displayModal=true;
        //MyModal.open();

    }

    handleCloseModal(){
        this.clearform();
        this.displayModal=false;
    }

    handleOppInput(event){
        const field=event.target.label;
        const value=event.target.value;
       // console.log("Field:",field);
       // console.log("Value:",value);
        if(field === 'Opportunity Name'){   
            this.oppName=value;
        }
        else if(field === 'Close Date'){
            this.closeDate=value;
        }
        else if(field === 'Stage'){
            this.stage=value;
        }
        else if(field === 'Amount'){
            this.amount=parseFloat(value);
        }
        console.log(this.oppName);
        console.log(this.closeDate);
        console.log(this.stage);
        console.log(this.amount);
        console.log(this.selectedAccId);

    }

     handleCancelClose(){
        this.clearform();
        this.displayModal=false;
    }
       

    async handleSave() {   
    try {
        this.isLoading = true;

        const newOpp = await createNewOpp({
            oppName: this.oppName,
            accountId: this.selectedAccId,
            stage: this.stage,
            closeDt: this.closeDate,
            amount: this.amount
        });
        console.log("New Opp: ", newOpp);

        const event = new ShowToastEvent({
            title: 'Success!',
            variant:'success',
            message: 'Record {0} created! See it {1}!!',
            messageData: [
                'Salesforce',
                {
                    url: `/${newOpp}`,
                    label: 'here',
                },
            ],
        });
        this.dispatchEvent(event);
        this.clearform();
        this.handleCloseModal();
        this.oppData = [...(await getAccountRelatedOpportunities({ accId: this.selectedAccId }))];
        console.log("Refreshed OppData:", this.oppData);
    } catch (error) {
        console.error(error);
    } finally {
        this.isLoading = false;
    }
}



    clearform(){
        this.oppName='';
        this.closeDate='';
        this.stage='';
        this.amount='';

    }

}