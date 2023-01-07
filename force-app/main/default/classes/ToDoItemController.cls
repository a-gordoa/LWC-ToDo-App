public with sharing class ToDoItemController {
    
    @AuraEnabled
    public static List<To_Do_Item__c> getToDoItems() {
        try {
            // add a "Assign To field, and have it filter based on current user
            List<To_Do_Item__c> toDoList = [SELECT Id, Subject__c, Status__c, Priority__c, Notes__c, Due_Date__c, Account__c FROM To_Do_Item__c]; 
            return toDoList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<To_Do_Item__c> updateDroppedToDoItem(String toDoItemId, String newStatus){
        // try {
            To_Do_Item__c todoitem_to_update = [SELECT Id, Status__c FROM To_Do_Item__c WHERE id = :toDoItemId LIMIT 1];

            // updates the TDI with with Status field from the section it was dropped into. 
            todoitem_to_update.Status__c = newStatus;

            //update todoitem_to_update;

             List<To_Do_Item__c> reutrnList = [SELECT Id, Status__c FROM To_Do_Item__c];
            
            return reutrnList;
            
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
    }
}