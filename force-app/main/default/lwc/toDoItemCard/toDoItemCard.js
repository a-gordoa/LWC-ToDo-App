import { api, LightningElement } from 'lwc';
import deleteToDoItem from '@salesforce/apex/ToDoItemController.deleteToDoItem';
import getToDoItemRecord from '@salesforce/apex/ToDoItemController.getToDoItemRecord';
import updateEditedToDoItem from '@salesforce/apex/ToDoItemController.updateEditedToDoItem';



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


  // Used to store and show the To Do field values in the Edit Modal
  editFieldSubjectValue;
  editFieldStatusValue;
  editFieldDateValue;
  editFieldPriorityValue;


  subjectChange(event) {
    this.editFieldSubjectValue = event.detail.value;
  }


  statusChange(event) {
    this.editFieldStatusValue = event.detail.value;
  }

  dateChange(event) {
    this.editFieldDateValue = event.detail.value;
  }

  priorityChange(event) {
    this.editFieldPriorityValue = event.detail.value;
  }


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



@api
toDoItem;

dragStart;

showEditModal = false;

itemDragStart(event) {
console.log(' itemDragStart this.toDoItem.Id = ' + this.toDoItem.Id);

this.dispatchEvent(new CustomEvent('startdrag', {detail: this.toDoItem.Id}));
console.log('this.dispatchEvent = ' + JSON.stringify(this.dispatchEvent));

}

renderedCallback() {
  this.addEventListener('dragstart', this.itemDragStart);
}

handleToDoUpdate() {
console.log('Success');
this.showEditModal = false;

// sends custom event that will refresh the 
this.dispatchEvent(new CustomEvent('updateordeletecompleted',  {detail: true}));
}

handleEdit(){
getToDoItemRecord({idArg: this.toDoItem.Id})
  .then(result=>{

    this.editFieldSubjectValue = result.Subject__c;
    this.editFieldStatusValue = result.Status__c;
    this.editFieldPriorityValue = result.Priority__c;
    this.editFieldDateValue = result.Due_Date__c;


    // toggles the switch to show the modal in the UI
    this.showEditModal = true;
  })
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

submitEditedToDoRecord() {
  updateEditedToDoItem({toDoItemId: this.toDoItem.Id, subjectArg: this.editFieldSubjectValue, dateArg: this.editFieldDateValue, priorityArg: this.editFieldPriorityValue, statusArg: this.editFieldStatusValue})
    .then(result=>{
      this.dispatchEvent(new CustomEvent('updateordeletecompleted',  {detail: true}));
      console.log('Made it pased Update Call')
      
      // toggles modal off
      this.showEditModal = false;
    })
  
}

handleReset() {
  this.showEditModal = false;
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