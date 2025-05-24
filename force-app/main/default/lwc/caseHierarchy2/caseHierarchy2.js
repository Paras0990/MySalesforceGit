import { LightningElement,api,wire } from 'lwc';
import getChildCases from '@salesforce/apex/caseHierarchyController.getChildCases';
import { NavigationMixin } from 'lightning/navigation';


export default class CaseHierarchy2 extends NavigationMixin(LightningElement) {
    @api recordId;
    cases=[];
    expandClicked=false;

    @wire(getChildCases,{recordId:'$recordId'})
    getCases({data,error}){
        if(data){
            this.cases=data;
            console.log('Cases:',this.cases);
        }else if(error){
            console.log('Error:',error);
        }
    }

    handleCaseClick(event){
        const caseId=event.currentTarget.dataset.id;
        console.log("Case ID:",caseId);
        console.log("Case ID type:",typeof caseId);

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:caseId,
                objectApiName: 'Case',
                actionName: 'view',
            },
        });


    }

    async expandHandler(event){
       const caseId=event.currentTarget.dataset.id;
       console.log("Case ID:",caseId);
       this.expandClicked=true;
        console.log("Expand clicked:",this.expandClicked);


         const childCases=await getChildCases({recordId:caseId});
          console.log("Child Cases:",childCases);

          this.cases = this.cases.map((currItem) => {
            if (currItem.Id === caseId) {
                console.log("currentItem:",currItem);
                return {...currItem, childCases}; // Add childCases property
            }
            return currItem;
        });
         console.log("Cases:",this.cases);


    }

    handleChildCaseClick(event){
         const caseId=event.currentTarget.dataset.id;
        console.log("Case ID:",caseId);
        console.log("Case ID type:",typeof caseId);

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:caseId,
                objectApiName: 'Case',
                actionName: 'view',
            },
        });

    }

    collapseHandler(event) {
        const caseId = event.currentTarget.dataset.id;

        this.cases = this.cases.map(currItem => {
            if (currItem.Id === caseId) {
                const { childCases, ...rest } = currItem;
                return rest;
            }
            return currItem;
        });
    }


}