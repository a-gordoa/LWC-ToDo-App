import { LightningElement, api, track, wire } from 'lwc';
import getToDoItems from '@salesforce/apex/ToDoItemController.getToDoItems';
import updateDroppedToDoItem from '@salesforce/apex/ToDoItemController.updateDroppedToDoItem';
import { updateRecord } from 'lightning/uiRecordApi';

import TO_DO_OBJ from '@salesforce/schema/To_Do_Item__c';
import SUBJECT_FIELD from '@salesforce/schema/To_do_Item__c.Subject__c';
import STATUS_FIELD from '@salesforce/schema/To_do_Item__c.Status__c';
import PRIORITY_FIELD from '@salesforce/schema/To_do_Item__c.Priority__c';
import DUE_DATE_FIELD from '@salesforce/schema/To_do_Item__c.Due_Date__c';
import ID_FIELD from '@salesforce/schema/To_do_Item__C.Id';
import { refreshApex } from '@salesforce/apex';


export default class ToDoApp extends LightningElement {

    // imports To Do custom object for use in the create record form 
    toDoObject = TO_DO_OBJ;
    
    // imports fields to be used in create record edit form
    dueDateField = DUE_DATE_FIELD;
    priorityField = PRIORITY_FIELD;
    statusField = STATUS_FIELD;
    subjectField = SUBJECT_FIELD;

    // initializes boolean that controlls 
    showNewRecordScreen = false;

    // Fires on "Save" when creating a new To Do
    // Refreshes the list of ToDoItems on screen and closes the New To Do window
    handleToDoCreated(event){
        refreshApex(this.wireDataHolderToRefresh);
        this.showNewRecordScreen = false;
    }
    
    // Fires on cancel button being pressed. 
    // Collects all input fields and resets them
    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        // resets bool that controls template toggle 
        this.showNewRecordScreen = false;

     }

    // Opens the new To Do window
    handleNewToDoClick() {
        this.showNewRecordScreen = true;
    }

    handleRefresh() {
        console.log('Delete Log. ' + JSON.stringify(this.wireDataHolderToRefresh));
        refreshApex(this.wireDataHolderToRefresh);
        
    }

    inProgressToggle = true;
    notStartedToggle = true;
    completedToggle = true;
    

    // holds all ToDoItems in a list
    @track
    ToDoItemList = [];

    // lists for the various status' of each ToDoItem, which will be used to
    // sort them into different drag/drop divs
    @track
    notStartedList = [];

    @track
    inProgressList= [];

    @track
    completedList=[];

    // used to store the ID of the card being dragged, which is then stored in the 
    // 
    draggingId;

    wireDataHolderToRefresh = null;


    // Stores the value and options that are used in the Radio Buttons for the filtering Status
    statusValue = 'All';
    get statusOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' }
        ];
    }


    // Stores the value and options that are used in the Radio Buttons for the filtering Status
    priorityValue = 'All';
    get priorityOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Low', value: 'Low' },
            { label: 'Normal', value: 'Normal'},
            { label: 'High', value: 'High' }
        ];
    }





    @wire(getToDoItems, {priorityArg: '$priorityValue'})
    ToDoItemListWire(value){

        const {data,error} = value;
        this.wireDataHolderToRefresh = value;
        if (data) {
            this.ToDoItemList = data;
            console.log('Wire Data = ' + JSON.stringify(data));
            console.log('this.ToDoItemList within WIRE = ' + JSON.stringify(this.ToDoItemList))
        
            this.sortToDoItems(this.ToDoItemList);
        } else if (error) {
            console.log('Wire Error = ' + JSON.stringify(error));
        }
    };


    
    sortToDoItems(ToDoItemList){
        this.notStartedList = [];
        this.inProgressList = [];
        this.completedList = [];
        // console.log(JSON.stringify(this.ToDoItemList));
        for (const iter of ToDoItemList) {
            console.log('iter Subj = ' + iter.Subject__c + ' Status  = ' + iter.Status__c)
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
        //console.log('Tagets = ' + JSON.stringify(targets));
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


    handleDropCompleted() {
        this.updateToDoFieldsOnDrop('Completed', this.draggingId);
    }

    handleDropInProgress() {
        this.updateToDoFieldsOnDrop('In Progress', this.draggingId);       
    }

    handleDropNotStarted() {
        this.updateToDoFieldsOnDrop('Not Started', this.draggingId);       
    }

    updateToDoFieldsOnDrop(status, toDoId) {

        const fields={};
        fields[ID_FIELD.fieldApiName] = toDoId;
        fields[STATUS_FIELD.fieldApiName] = status;
        console.log(JSON.stringify('fields = ' +  JSON.stringify(fields)));
        
        const recordInput = {fields}
        console.log(JSON.stringify('recordInput = ' + JSON.stringify(recordInput)));
        updateRecord(recordInput)   
            .then(() => {
                refreshApex(this.wireDataHolderToRefresh);
            })
            .catch(error=>{
                console.log('Made it to RECORD ERROR = ' + error.message + ' CODE = ' + error.errorCode + ' error Obj = ' + JSON.stringify(error));
                refreshApex(this.wireDataHolderToRefresh);
            })
    }


    handlePriorityFilterSelect(event) {
        this.priorityValue = event.detail.value;
        console.log('this.priorityValue = ' + this.priorityValue);
    }

    handleStatusFilterSelect(event) {

        this.statusValue = event.detail.value;
        
        switch (this.statusValue) {
            case 'Not Started':
                this.notStartedToggle = true;
                this.inProgressToggle = false;
                this.completedToggle = false;
                break;

            case 'In Progress':
                this.notStartedToggle = false;
                this.inProgressToggle = true;
                this.completedToggle = false;
                break; 

            case 'Completed':
                this.notStartedToggle = false;
                this.inProgressToggle = false;
                this.completedToggle = true;
                break;
                
            case 'All':
                this.notStartedToggle = true;
                this.inProgressToggle = true;
                this.completedToggle = true;
                break;    
        
            default:
                break;
        }

    }

    
}