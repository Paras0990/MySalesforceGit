import { LightningElement } from 'lwc';

export default class ToDoManagerComponent extends LightningElement {

    taskName=" ";
    endDate=null;

    incompletedtask=[];
    completedtask=[];

    taskChangeHandler(event){
        this.taskName = event.target.value;
        console.log('Task Name: ' + this.taskName);
    }
    dateChangeHandler(event){
        this.endDate = event.target.value;
        console.log('End Date: ' + this.endDate);

    }

    handleReset(){
        console.log('Resetting the form');
        this.taskName="";
        this.endDate=null;

    }

    handleAddTask(){
        console.log('Entering the ADD task');
        //if task end date is empty then set set it to today's date
        if(!this.endDate){
            this.endDate=new Date().toISOString().slice(0, 10);
        }

        if(this.validateTask()){
            console.log('Validate successfully');
            this.incompletedtask=[...this.incompletedtask,
                {
                    taskName: this.taskName,
                    endDate: this.endDate
                }
            ];
            this.handleReset();
            let sortedArray=this.sortTask(this.incompletedtask);
            console.log('New Sorted array:', sortedArray);

            this.incompletedtask=[...sortedArray];
            console.log('Incompleted task: ',this.incompletedtask);
           
        }
    }

    validateTask(){
        console.log('Entering the validate task');

        let isValid=true;
        let element=this.template.querySelector(".taskname");

        //Condition 1-> Check if task is empty
        //Condition 2-> If taksname is not empty then check for duplicate

        if(!this.taskName){
            console.log('Enterig if');
            isValid=false;
       }else{
        console.log('Enterig else');
            let taskItem= this.incompletedtask.find(
                (currentItem)=>
                    currentItem.taskName ===this.taskName &&
                    currentItem.endDate ===this.endDate
            );
            if(taskItem){
                console.log('enterimng taskitem');
                isValid=false;
                element.setCustomValidity("Task already exists");

            }
         
       }

       if(isValid){
        console.log('Entering the isvalid',isValid);
        element.setCustomValidity("");
        console.log('Entering after setcustomvalidity');
       }
       console.log('Outside isvlaid IF');
       element.reportValidity();
       console.log('Exiting the validate task', isValid);

       return isValid;
      
      
    }

    sortTask(inputarray){
        console.log('Entering the sort task');
        let sortedArray=inputarray.sort((a,b)=>{
            const dateA=new Date(a.endDate);
            const dateB=new Date(b.endDate);
            return dateA-dateB;
        }
    );
    console.log('Sorted array:', sortedArray);
    return sortedArray;
    }

    handleDeleteTask(event){
        console.log('Entering the delete task');
        let index=event.target.name;
        console.log('Index ',index);

        this.incompletedtask.splice(index,1);

        let sortedArray=this.sortTask(this.incompletedtask);
            console.log('New Sorted array:', sortedArray);

            this.incompletedtask=[...sortedArray];
            console.log('Incompleted task: ',this.incompletedtask);


    }

    handleCompleteTask(event){
        console.log('Entering the complete task');

        let index=event.target.name;
        console.log('Index ',index);

        let completedItem=this.incompletedtask.splice(index,1);
        console.log('Completed item',completedItem);
        let sortedArray=this.sortTask(this.incompletedtask);

            this.incompletedtask=[...sortedArray];
          

        this.completedtask=[...this.completedtask,completedItem[0]];
        console.log('Completetd Array',this.completedtask);

    }

}