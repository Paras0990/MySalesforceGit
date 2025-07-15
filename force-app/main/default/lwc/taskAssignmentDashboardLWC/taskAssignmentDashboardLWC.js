import { LightningElement,wire,track } from 'lwc';
import getOpenTasks from '@salesforce/apex/TaskAssignementController.getOpenTasks';
import getAllUsers from '@salesforce/apex/TaskAssignementController.getAllUsers';
import updateTaskRecord from '@salesforce/apex/TaskAssignementController.updateTaskRecord';

import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class TaskAssignmentDashboardLWC extends LightningElement {
    openTasks;
    wiredTaskResults;

    highClick=false;
    medClick=false;
    lowClick=false;

    highLength;
    mediumLength;
    lowLength;

    @track groupedTasks={
        High:[],
        Medium:[],
        Low:[]
    };

    @track finalTaskGroup;

    users;

    @wire(getOpenTasks)
    wiredTasks(result){
        this.wiredTaskResults=result;
        if(result.data){
            this.openTasks=result.data;
            this.groupTask(result.data);
            console.log("Task Result: ",result.data);
            //console.log("Grouped Task Result: ",JSON.stringify(this.groupedTasks, null, 2));
            this.finalTaskGroup=JSON.stringify(this.groupedTasks, null, 2);
             //console.log("Final Grouped Tasks: ", this.finalTaskGroup);
        }else if(result.error){
            console.log("Error: ", error);
        }
    }

    @wire(getAllUsers)
    wiredAllUsers({data,error}){
        if(data){
            this.users=data.map(currItem=>({
                label:currItem.Name,
                value:currItem.Id
            }));
            console.log("DATA: ",this.users);
        }else if(error){
            console.log("ERROR: ",error);
        }
    }

    groupTask(tasks){
        console.log("<-- INSIDE groupTask func --->");
        console.log("LEngth :" ,tasks.length);
        this.groupedTasks={
            High:[],
            Medium:[],
            Low:[]
        };

        for(let i = 0; i < tasks.length; i++) {
           if(tasks[i].Priority === 'High'){
                this.groupedTasks['High'].push(tasks[i]);
           }else if(tasks[i].Priority === 'Normal'){
                this.groupedTasks['Medium'].push(tasks[i]);
           }else if(tasks[i].Priority === 'Low' || tasks[i].Priority == null){
                 this.groupedTasks['Low'].push(tasks[i]);
           }
        }
        this.highLength=this.groupedTasks.High.length;
        this.mediumLength=this.groupedTasks.Medium.length;
        this.lowLength=this.groupedTasks.Low.length;
        console.log("High Tasks: ", this.groupedTasks.High.length);
        console.log("Medium Tasks: ", this.groupedTasks.Medium.length);
        console.log("Low Tasks: ", this.groupedTasks.Low.length);
        

    }

    highExpandHandler(){
        console.log("<-- Insdie High handler -->");
        this.highClick=true;
        this.medClick=false;
        this.lowClick=false;
    }

   medExpandHandler(){
        console.log("<-- Insdie Medium handler -->");
        this.medClick=true;
        this.highClick=false;
        this.lowClick=false;
    }

    lowExpandHandler(){
        console.log("<-- Insdie Low handler -->");
        this.lowClick=true;
        this.highClick=false;
        this.medClick=false;
    }

    async handleChange(event){
        const userId=event.target.value;
        const name=event.target.label;
        console.log("Clicked User Id: ",userId);
        console.log("Clicked User Name: ",name);

        const taskId=event.currentTarget.dataset.id;
        console.log("Task User Id: ",taskId);

        let updatedtkRec=await updateTaskRecord({taskId:taskId,userId:userId});
        console.log("Update Task record; ",updatedtkRec);

        const updatedOwnerName=updatedtkRec.Owner.Name;
        console.log("Update Task Owner Name; ",updatedOwnerName);

        if(updatedtkRec){
            const event = new ShowToastEvent({
            title: 'Success!',
            message: `Task ${updatedtkRec.Id} Assignee is updated ` ,
            variant:'success'
            
        });
        this.dispatchEvent(event);
        }

        refreshApex(this.wiredTaskResults);


    }

    closeHandler(){
        this.highClick=false;
        this.medClick=false;
        this.lowClick=false;
    }



    

}