import { LightningElement,api } from 'lwc';

 const columns = [
    { label: 'File Name', fieldName: 'name' },
    { label: 'Document Id', fieldName: 'documentId' }

    ];
  
export default class FileUploaderlwc extends LightningElement {
    @api myRecordId;
    columns=columns;
    data=[];


    get acceptedFormats() {
        return ['.pdf', '.png', '.jpeg', '.jpg' ];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        const recId=this.myRecordId;
        console.log('Id : ',recId);
        console.log('Files: ',uploadedFiles);
        //alert('No. of files uploaded : ' + uploadedFiles.length);

        this.data=[...uploadedFiles];
        console.log('Data',this.data);
    }

    

}