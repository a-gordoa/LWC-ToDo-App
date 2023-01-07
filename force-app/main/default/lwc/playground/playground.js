import { LightningElement, wire } from "lwc";
import getToDoItems from "@salesforce/apex/ToDoItemController.getToDoItems"; 

export default class App extends LightningElement {  
  
  toDoItemList;
  handleGetTasks(){
    getToDoItems()
    .then( result =>{
      this.toDoItemList = result;
    })
    .catch(error =>{
      console.log('toDoItemList Error message: ' + error.message + ' error name: ' + error.name + ' error stack: ' + error.stack);
    })
  }
  

  createToDoItemToggle;
  handleToggle(event) {
    console.log('Toggle Value = ' + event.target.checked);
    this.createToDoItemToggle = event.target.checked;
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