import { LightningElement, api, track, wire } from 'lwc';
import getToDoItems from '@salesforce/apex/ToDoItemController.getToDoItems';
import updateDroppedToDoItem from '@salesforce/apex/ToDoItemController.updateDroppedToDoItem';
import { updateRecord } from 'lightning/uiRecordApi';
import SUBJECT_FIELD from '@salesforce/schema/To_do_Item__C.Subject__c';
import STATUS_FIELD from '@salesforce/schema/To_do_Item__C.Status__c';
import ID_FIELD from '@salesforce/schema/To_do_Item__C.Id';
import { refreshApex } from '@salesforce/apex';


export default class ToDoApp extends LightningElement {

    

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

    draggingId;

    refreshToken = 1;

    wireDataHolderToRefresh = null;




    @wire(getToDoItems)
    ToDoItemListWire(value){

        const {data,error} = value;
        this.wireDataHolderToRefresh = value;
        if (data) {
            this.ToDoItemList = data;
            console.log('Wire Data = ' + JSON.stringify(data));
            console.log('this.ToDoItemList within WIRE = ' + JSON.stringify(this.ToDoItemList))
        
            this.sortToDoItems(this.ToDoItemList);
        } else if (error) {
            console.log('Wire Error = ' + error);
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
                this.refreshToken = Date.now();
                refreshApex(this.wireDataHolderToRefresh);
            })
            .catch(error=>{
                console.log('Made it to RECORD ERROR = ' + error.message + ' CODE = ' + error.errorCode )
                refreshApex(this.wireDataHolderToRefresh);
            })
    }



    
}