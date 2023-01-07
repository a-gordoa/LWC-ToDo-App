import { LightningElement, api, track, wire } from 'lwc';
import getToDoItems from '@salesforce/apex/ToDoItemController.getToDoItems';
import updateDroppedToDoItem from '@salesforce/apex/ToDoItemController.updateDroppedToDoItem';

export default class ToDoApp extends LightningElement {

    

    // holds all ToDoItems in a list
    ToDoItemList;

    // lists for the various status' of each ToDoItem, which will be used to
    // sort them into different drag/drop divs
    @track
    notStartedList = [];

    @track
    inProgressList= [];

    @track
    completedList=[];

    draggingId;

    @track
    newStatusFromDrop;

    
    // @wire(updateDroppedToDoItem,{toDoItemId: this.draggingId, newStatus: '$newStatusFromDrop'})
    // toDoItemsFromApex({data,error}){
    //     console.log('WIRE CALL PRE IF. DATA = ' +JSON.stringify(data) + ' Error = ' + JSON.stringify(error));
    //     if (data) {
    //     console.log('WIRE DATA. STATUS = ' + this.newStatusFromDrop);    
    //     this.newStatusFromDrop = '';

    //     } else if (error) {
    //         console.log('Wire ERROR = ' + error.message)
    //     } else {
    //         console.log('Wire received nothing')
    //     }
    // }

    
    


    connectedCallback(){
        // collects all ToDoItems in the system
        getToDoItems()
        .then( result =>{
            this.toDoItemList = result;
            // sorts the toDoItems into their respective lists
            //this.sortToDoItems(this.toDoItemList);
            //console.log(JSON.stringify(result));

            this.sortToDoItems(this.toDoItemList);

            console.log('notStartedList = ' + this.notStartedList);


        })
        .catch(error =>{
            console.log('toDoItemList Error message: ' + error.message + ' error name: ' + error.name + ' error stack: ' + error.stack);
        })
    }
    
    sortToDoItems(ToDoItemList){
        for (const iter of ToDoItemList) {
            console.log('iter = ' + iter.Status__c)
            switch (iter.Status__c) {
                case 'Not Started' : this.notStartedList.push(iter);
                break;

                case 'In Progress' : this.inProgressList.push(iter);
                break;

                case 'Completed' : this.completedList.push(iter);
                break;

            }
        }
    }


    renderedCallback() {
        const targets = this.template.querySelectorAll(".target");
        console.log('Tagets = ' + JSON.stringify(targets));
        targets.forEach(target=>{
            //target.addEventListener('drop',this.handleDrop);
            target.addEventListener('dragover', this.handleDragOver);
            target.addEventListener('dragenter', this.handleDragEnter);
        })
    }

    handleStartDrag(event) {
        this.draggingId = event.detail;
        console.log('PArent handleStartDrag event ID =' + this.draggingId);
    }

    handleDragEnter(event){
        console.log('handleDragEnter = ' + JSON.stringify(event) );
        event.preventDefault();
    }

    handleDragOver(event) {
        event.preventDefault();
        return false;
      }


      handleDropCompleted(event) {
        console.log('handleDropCompleted ASDFASDF');
        this.newStatusFromDrop = 'In Completed';
    
    }
    handleDropInProgress(event) {

        // console.log('handleDropInProgress ASDFASDF');
        // this.newStatusFromDrop = 'In Progress';
        // console.log('HandleDrop Staus = ' + this.newStatusFromDrop + ' ID = ' + this.draggingId);
        //updateDroppedToDoItem(String toDoItemId, String newStatus)
        updateDroppedToDoItem({toDoItemId: this.draggingId, newStatus: 'In Progress'})
        .then(result=>{
            getToDoItems()
                .then( result =>{
                this.toDoItemList = result;
                // sorts the toDoItems into their respective lists
                //this.sortToDoItems(this.toDoItemList);
                //console.log(JSON.stringify(result));

                this.sortToDoItems(this.toDoItemList);
                console.log('notStartedList = ' + this.notStartedList);
                })
                .catch(error =>{
                    console.log('toDoItemList Error message: ' + error.message + ' error name: ' + error.name + ' error stack: ' + error.stack);
                })
        })
        .catch(error=>{
            console.log('handleDropInProgress Error message: ' + error.message + ' error name: ' + error.name + ' error stack: ' + error.stack);
        })

        

    }

    // handleDrop(event) {
    //     console.log('Dropped. Event = ' + JSON.stringify(event));
    //     // console.log('event for handleDrop = ' + JSON.stringify(event));
    //     // var divId = event.dataTransfer;
    //     // console.log('divID =' + JSON.stringify(divId));
    //     event.stopPropagation();

        
    // }
    


   


    
}