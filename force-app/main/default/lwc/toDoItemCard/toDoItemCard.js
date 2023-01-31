import { api, LightningElement } from 'lwc';
import deleteToDoItem from '@salesforce/apex/ToDoItemController.deleteToDoItem';
import TO_DO_OBJ from '@salesforce/schema/To_Do_Item__c';
import SUBJECT_FIELD from '@salesforce/schema/To_do_Item__c.Subject__c';
import STATUS_FIELD from '@salesforce/schema/To_do_Item__c.Status__c';
import PRIORITY_FIELD from '@salesforce/schema/To_do_Item__c.Priority__c';
import DUE_DATE_FIELD from '@salesforce/schema/To_do_Item__c.Due_Date__c';
import ID_FIELD from '@salesforce/schema/To_do_Item__C.Id';

export default class ToDoItemCard extends LightningElement {


  // imports To Do custom object for use in the create record form 
  toDoObject = TO_DO_OBJ;

  // imports fields to be used in create record edit form
  dueDateField = DUE_DATE_FIELD;
  priorityField = PRIORITY_FIELD;
  statusField = STATUS_FIELD;
  subjectField = SUBJECT_FIELD;

    @api
    toDoItem;

    dragStart;

    showEditModal = false;

    renderedCallback() {
        this.addEventListener('dragstart', this.itemDragStart);
    }

    itemDragStart(event) {
    
        this.dispatchEvent(CustomEvent('startdrag', {detail: this.toDoItem.Id}));
        // this.dispatchEvent(CustomEvent('startdrag', {detail: 'asdf'}));
        
        // console.log('itemDragStart event = ' + JSON.stringify(event));
        // event.dataTransfer.setData("text/plain", 'You did it');

        // this.dragStart = event.target.title;
        // console.log('event.target.title = ' + event.target.title);

    }

    handleToDoUpdate() {
      console.log('Success');
      this.showEditModal = false;

      // sends custom event that will refresh the 
      this.dispatchEvent(new CustomEvent('updateordeletecompleted',  {detail: true}));
    }

    handleEdit(){
      this.showEditModal = true;
    }

    handleDelete(event) {

      // Calls apex to delete item
      deleteToDoItem({ id: this.toDoItem.Id })
        .then((result)=>{
          console.log('Made it to delete call')
          
          // Send custom message to parent component to refresh the wire
        this.dispatchEvent(new CustomEvent('updateordeletecompleted',  {detail: true}));

        })

      
      
        
    }

    testData = [{
        Subject__c: "ToDo Title",
        Status__c: "In Progress",
        Account__c:'001Dn000004qx4dIAA',
        Notes__c: "Still working, but will be done soon",
        Due_Date__c: "2022-01-23",
        Priority__c: 'Normal',
        CreatedById: '005Dn000001I66XIAS',
        Id: 'a01Dn000008hSkgIAE',
        Name: 'ToDo-0001'
      },
      {Subject__c: "ToDo Title 2",
        Status__c: "Blocked",
        Account__c:'001Dn000004qx4dIAA',
        Notes__c: "Still working, but will be done soon",
        Due_Date__c: "2022-01-23",
        Priority__c: 'Normal',
        CreatedById: '005Dn000001I66XIAS',
        Id: 'a01Dn000008hSkgIAE',
        Name: 'ToDo-0001'
      }]
}