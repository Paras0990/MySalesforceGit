import { LightningElement,wire } from 'lwc';
import getObjects from '@salesforce/apex/getObjectsController.getObjects';
import getObjFields from'@salesforce/apex/getObjectsController.getObjFields';
import getAccounts from'@salesforce/apex/getObjectsController.getAccounts';


const columns = [
    { label: 'Label', fieldName: 'Label' },
    { label: 'API Name', fieldName: 'QualifiedApiName' },
];


export default class RecentRecordFetcher extends LightningElement {
    columns=columns;
    result=[];
    value;
    objSelected=false;
    fields;
    selectedField;
    arr;
    recordsFound=false;
    recordsColumns;
    getQuery;



    @wire(getObjects)
    getSObjects({data,error}){
        if(data){
            this.result=data.map(currItem=>({
                label: currItem.Label,
                value: currItem.QualifiedApiName
            }));
            console.log("Objects Data :",this.result);
            
        }
        else if(error){
            console.log("Objects Error :",error);
        }
    }

    async handleChange(event){
        this.recordsFound=false;

        this.value=event.target.value;
        console.log("Value: ",this.value);
        if(this.value){
            this.objSelected=true;
            const fieldsInfo=await getObjFields({objLabel:this.value});
            this.fields=fieldsInfo;
            console.log("Fields Info: ",fieldsInfo);
            console.log("Fields: ",this.fields);

        }


    }

    getSelectedName(event){
        this.selectedField=event.detail.selectedRows;
        for(let i=0;i<this.selectedField.length;i++){
            console.log("Selected Field: ",this.selectedField[i].QualifiedApiName);
        }
        const selectedFieldCopy = JSON.parse(JSON.stringify(this.selectedField));
        this.recordsColumns = selectedFieldCopy.map(({ Label, QualifiedApiName }) => ({
            label: Label,
            fieldName: QualifiedApiName
        }));
        console.log("Record Columns:",this.recordsColumns);
        
    }

    async handleClick(){
        if(this.selectedField){
            console.log("<---Inside handle click --->");
            console.log("Selected Rows:",this.selectedField);

             for(let i=0;i<this.selectedField.length;i++){
            console.log("Selected Field for Query: ",this.selectedField[i].QualifiedApiName);
            console.log("Type Of: ",typeof(this.selectedField[i].QualifiedApiName));

        }
        const qualifiedApiNames = this.selectedField.map(({ QualifiedApiName }) => QualifiedApiName);
        console.log("qualifiedApiNames Results: ",qualifiedApiNames);
        console.log("Type Of: ",typeof(this.selectedField));
        console.log("ObjAPI Name:",this.value);
        console.log("Type OF ObjAPI Name:",typeof(this.value));

        


        this.getQuery=await getAccounts({fields: qualifiedApiNames, objAPIName:this.value});
            console.log("Query Results: ",this.getQuery);
        }

        this.objSelected=false;
        this.recordsFound=true;

    }
    
    

    
}