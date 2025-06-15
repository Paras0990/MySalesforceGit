import { LightningElement,wire } from 'lwc';
import getTechnicianUsers from '@salesforce/apex/ServicebookingLwcController.getTechnicianUsers';
import getUser from '@salesforce/apex/ServicebookingLwcController.getUser';
import isConflict from '@salesforce/apex/ServicebookingLwcController.isConflict';
import createSBRecord from '@salesforce/apex/ServicebookingLwcController.createSBRecord'

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY=500;


export default class ServiceBookingLwc extends LightningElement {
    searchTerm;
    delayTimeout;
    techResult;
    selectedTechnician;
    displayTechinicians=false;
    selectedTechName='';
    displaySearchIcon=true;

    selectedStartDT;
    selectedEndDT;
    serviceBookingName;

    user={};
    selectedUserId;

    allFieldsFilled=false;

    conflict=false;
    buttonDisabled=true;

    inputHandler(event){
        window.clearTimeout(this.delayTimeout);
        let enteredValue=event.target.value;
        //Debouncing -- do not update the reactive property as long as this function is called within the delay.
        this.delayTimeout=setTimeout(()=>{
            this.searchTerm=enteredValue;
            console.log("Search Term:",this.searchTerm);
           
        },DELAY);
    }

    @wire(getTechnicianUsers,
        {
            searchKey:"$searchTerm"
        } 
    
    )searchTechnicians({data,error}){
        if(data){
            console.log("DATA:",data);
            this.techResult=data;
            console.log("Tech Result:",this.techResult);
            this.displayTechinicians=true;
        }
        else if(error){
             console.log("ERROR:",error);
        }
    }

    async userClickHandler(event){
        console.log("<---- INSIDE USER CLICK --->");
        const technicianId = event.currentTarget.dataset.id;
        this.selectedTechnician = technicianId;

        console.log("Selected Technician Id:", this.selectedTechnician);
        if(this.selectedTechnician){
            this.displayTechinicians=false;
        }

        if(!this.displayTechinicians){
            this.user=await getUser({userId:this.selectedTechnician});
            this.selectedTechName=this.user.Name;
            this.selectedUserId=this.user.Id;
            this.displaySearchIcon=false;
            console.log("USer from Apex:", this.user);
            console.log("User Name:", this.user.Name);
            console.log("User Id:", this.user.Id);
            console.log("Type Of User Id:", typeof(this.user.Id));
        }

    }

    async handleDateChange(event){
        const field=event.target.name;
        const value=event.target.value;

        console.log("Field:",field);
        console.log("Value:",value);
        if(field=== 'startDateTime'){
            this.selectedStartDT=value;
        }
        else if(field === 'endDateTime'){
            this.selectedEndDT=value;
        }
        else if(field === 'serviceBookingName'){
            this.serviceBookingName=value;

        }

        if(this.selectedTechName && this.selectedStartDT && this.selectedEndDT){
            console.log("All three fields are filled");

            this.allFieldsFilled=true;
            console.log("All fields filled:",this.allFieldsFilled);
        }

        if(this.allFieldsFilled){
            console.log("<---- Inside IF all Fields Filled---->");
            this.conflict=await isConflict({ userId:this.selectedUserId ,
                                             startDT:this.selectedStartDT ,
                                             endDT:this.selectedEndDT});

            console.log("isConflict called:",this.conflict);

            if(this.conflict){
               
            const event = new ShowToastEvent({
            title: 'You Hit a Snag!',
            message: `Technician not available in selected slot.
            The Timeslot selected (StartDate and EndDate) is already booked with ${this.selectedTechName} ,Please close this pop up and select
             different Date Time for successfull appointment.`,
            mode: 'dismissible',
            variant:'error'
        });
        this.dispatchEvent(event);
            }
            else{
                this.buttonDisabled=false;
            }
        }
    }

    async handleSave(){
        if(this.conflict){
            const event = new ShowToastEvent({
            title: 'You Hit a Snag!',
            message: `Technician not available in selected slot.
            The Timeslot selected (StartDate and EndDate) is already booked with ${this.selectedTechName} ,please change the timings and book again ,
            Please close this pop up and select different Date Time and Try saving again`
            ,
            mode: 'sticky',
            variant:'error'
        });
         this.dispatchEvent(event);
        }
        else{
            const createrecord=await createSBRecord({userId:this.selectedUserId ,
                                             name:this.serviceBookingName,
                                             startDT:this.selectedStartDT ,
                                             endDT:this.selectedEndDT});

                                             console.log("Record Created;",createrecord );

            if(createrecord){
                const event = new ShowToastEvent({
                title: 'Success!',
                message: `The Service Booking has successfully been done .The Technician ${this.selectedTechName} will soon reach out to you!
                Thanks`
                ,
                mode: 'dismissible',
                variant:'success'
            });
            this.dispatchEvent(event);
            }
        }
        
    }



}