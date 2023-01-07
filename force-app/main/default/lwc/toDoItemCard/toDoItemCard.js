import { api, LightningElement } from 'lwc';

export default class ToDoItemCard extends LightningElement {

    @api
    toDoItem;

    dragStart;

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