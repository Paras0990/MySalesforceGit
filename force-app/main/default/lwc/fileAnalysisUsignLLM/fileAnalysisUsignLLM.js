import { LightningElement } from 'lwc';
import getContentVersionToString from '@salesforce/apex/FileAnalysisUsingLLMController.getContentVersionToString';
import llmAnalysis from '@salesforce/apex/FileAnalysisUsingLLMController.llmAnalysis';


export default class FileAnalysisUsignLLM extends LightningElement {

    promptInstructions;
    documentId;
    documentName;
    analysedData;
    showData=false;

    get acceptedFormats() {
        return ['.pdf'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        console.log("Type OF Files:",typeof(uploadedFiles));
        console.log("ID: ",uploadedFiles[0].documentId);
        console.log("ID: ",uploadedFiles[0].name);
        this.documentId=uploadedFiles[0].documentId;
        this.documentName=uploadedFiles[0].name;



        getContentVersionToString({documentId:this.documentId})
        .then(base64=>{
            let base64Content=base64;
            console.log("Base64 Content:", base64Content);
            
            llmAnalysis({docName:this.documentName,
            fileBase64:base64Content,
            instructions:this.promptInstructions
                }).then(result=>{
            this.analysedData=result;
            if(this.analysedData){
                this.showData=true;
            }
             console.log("Result:", result);
            })
                .catch(error => {
            console.error("Error fetching Result:", error);
            });
        })
        .catch(error => {
            console.error("Error fetching Base64:", error);
        });
        
        


      
    }

    captureInstructions(event){
        this.promptInstructions=event.detail.value;
        console.log("Instruction:",this.promptInstructions);
    }

    handleClear(){
        this.promptInstructions='';
    }

    handleClose(){
        console.log("<<--- Inside Close --->>");
        this.showData=false;
    }
}