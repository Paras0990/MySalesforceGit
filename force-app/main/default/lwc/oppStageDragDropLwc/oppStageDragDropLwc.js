import { LightningElement,track,wire } from 'lwc';
import getAllProspectingOpps from '@salesforce/apex/OppStageDragDropController.getAllProspectingOpps';
import getClosedWon from '@salesforce/apex/OppStageDragDropController.getClosedWon';
import getClosedLost from '@salesforce/apex/OppStageDragDropController.getClosedLost';
import updateOpportunity from '@salesforce/apex/OppStageDragDropController.updateOpportunity';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OppStageDragDropLwc extends LightningElement {
    searchTerm='';
    @track prospectingOpps=[];
    @track wonOpps=[];
    @track lostOpps=[];

    wiredProspecting;
    wiredClosedWon;
    wiredClosedLost;

    updatedOppName;
    updatedOppStageName

    @wire(getAllProspectingOpps,{searchTerm:'$searchTerm'})
    wiredProspectingOpps(value){
    this.wiredProspecting = value;
    const { data, error } = value;
        if(data){
            this.prospectingOpps=[...data];
             console.log("Data Opps:",data);
            console.log("Prospecting Opps:",this.prospectingOpps);

        }else if(error){
             console.log("Error :",error);
        }
    }
     @wire(getClosedWon)
     wiredClosedWonOpps(value){
    this.wiredClosedWon = value;
    const { data, error } = value;
        if(data){
            this.wonOpps=data;
             console.log("Data Opps:",data);
            console.log("Closed Won Opps:",this.wonOpps);

        }else if(error){
             console.log("Error :",error);
        }
    }

    @wire(getClosedLost)
     wiredClosedLostOpps(value){
    this.wiredClosedLost = value;
    const { data, error } = value;
        if(data){
            this.lostOpps=data;
             console.log("Data Opps:",data);
            console.log("Closed Won Opps:",this.lostOpps);

        }else if(error){
             console.log("Error :",error);
        }
    }
    

    handleSearch(event){
        this.searchTerm=event.target.value;
        console.log("Search Term: ", this.searchTerm);
    }

    handleDragStart(event){
        const draggedItemId=event.currentTarget.dataset.id;
        console.log("Dragged Item id: ",draggedItemId);
        event.dataTransfer.setData('text/plain', draggedItemId);
        event.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(event){
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    async handleDrop(event){
        const droppedOppId=event.dataTransfer.getData('text/plain');
        console.log("Dropped Item Id: ",droppedOppId);

        const newStage=event.currentTarget.dataset.stage;
        console.log("Dropping Stage :", newStage);

        if(!droppedOppId || !newStage) return;

        const updatedOpp=await updateOpportunity({oppId:droppedOppId,stageName:newStage});
        console.log("Updated Opp: ",updatedOpp);
        this.updatedOppName=updatedOpp.Name;
        console.log("Opp Name: ",this.updatedOppName);
        this.updatedOppStageName=updatedOpp.StageName;
        console.log("Opp Stage Name: ",this.updatedOppStageName);


        if(updatedOpp){
            this.showToast();
            await refreshApex(this.wiredProspecting);
            await refreshApex(this.wiredClosedWon);
            await refreshApex(this.wiredClosedLost);

        }

    }

    showToast() {
        const event = new ShowToastEvent({
            title: 'SUCCESS',
            message:
                'Opportunity ' + this.updatedOppName + ' Stage updated to ' + this.updatedOppStageName ,
            variant:'success'
        });
        this.dispatchEvent(event);
    }
  
   

    
   

}