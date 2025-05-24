import { LightningElement,api,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'; 
import getChildCases from '@salesforce/apex/caseHierarchyController.getChildCases';

const actions = [
    { label: 'Show Child Cases', name: 'expand_cases' },
    { label: 'Hide Child Cases', name: 'collapse_cases' }
];

const columns = [
    { label: 'CaseNumber', fieldName: 'CaseNumber',type:'button', typeAttributes: {label: { fieldName: 'CaseNumber' },name:'view_case',variant:'base' } },
    { label: 'Subject', fieldName: 'Subject'},
    { label: 'Origin', fieldName: 'Origin'},
    {
        type: 'action',
        typeAttributes: {
             rowActions: actions, menuAlignment: 'right' 
             }
    }
];

export default class CaseHierarchyLwc extends NavigationMixin(LightningElement) {

    @api recordId;
    columns=columns;
    cases=[];
    expandedRows=new Set();
    //childCases=[];
    //childCaseId='';


    @wire(getChildCases,{recordId:'$recordId'})
    getCases({data,error}){
        if(data){
            this.cases=data;
            console.log('Data:',data);
        }
        else if(error){
            console.log('Error:',error);
        }

    }

    async handleRowAction(event){
        console.log('<---Inside Handle Row Action-->');
        const actionName=event.detail.action.name;
        console.log('Action Name:',actionName);
        const row = event.detail.row;
        console.log('Row :',row);

        if(actionName==='view_case'){
            this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Case',
                actionName: 'view'
            },
        });
    } 
        else if(actionName==='expand_cases'){
            console.log('<--Inside Expand click-->');
            console.log('RowID :',row.Id);
            console.log('Row Type:',typeof row.Id );

            if(!this.expandedRows.has(row.Id)){
                const childCases= await getChildCases({recordId:row.Id});
                console.log('Child Cases:',childCases);

                const modifiedChildren = childCases.map(currItem => ({
                    ...currItem,
                    CaseNumber: '-->' + currItem.CaseNumber,
                    ParentId: row.Id
                }));
                console.log('Modified Children:',modifiedChildren);

                const parentIndex = this.cases.findIndex(c => c.Id === row.Id);
                let updatedCases = JSON.parse(JSON.stringify(this.cases));
                updatedCases.splice(parentIndex + 1, 0, ...modifiedChildren);
                this.cases = updatedCases;

                this.expandedRows.add(row.Id);

            }
            

        }

        else if (actionName === 'collapse_cases') {
            this.cases = this.cases.filter(c => c.ParentId !== row.Id);
            this.cases = [...this.cases];
            this.expandedRows.delete(row.Id);
        }

    }

}