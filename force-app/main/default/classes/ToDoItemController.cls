public without sharing class ToDoItemController {
    
    @AuraEnabled (cacheable=true)
    public static List<To_Do_Item__c> getToDoItems(String priorityArg) {
        try {
            // add a "Assign To field, and have it filter based on current user

            if (priorityArg == null || priorityArg == 'All') {
                List<To_Do_Item__c> toDoList = [SELECT Id, Subject__c, Status__c, Priority__c, Notes__c, Due_Date__c, Account__c FROM To_Do_Item__c]; 
                return toDoList;
            } else {
                List<To_Do_Item__c> toDoList = [SELECT Id, Subject__c, Status__c, Priority__c, Notes__c, Due_Date__c, Account__c FROM To_Do_Item__c WHERE Priority__c = :priorityArg]; 
            return toDoList;
            }
            
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

            update todoitem_to_update;

             List<To_Do_Item__c> reutrnList = [SELECT Id, Status__c FROM To_Do_Item__c];
            
            return reutrnList;
        
    }

    @AuraEnabled
    public static To_Do_Item__c updateEditedToDoItem(String toDoItemId, String subjectArg, Date dateArg, String statusArg, String priorityArg){
        // try {
            To_Do_Item__c todoitem_to_update = [SELECT Id, Status__c, Due_Date__c, Priority__c, Subject__c, Notes__c FROM To_Do_Item__c WHERE id = :toDoItemId LIMIT 1];

            // updates the TDI with with Status field from the section it was dropped into. 
            todoitem_to_update.Status__c = statusArg;
            todoitem_to_update.Due_Date__c = dateArg;
            todoitem_to_update.Priority__c = priorityArg;
            //todoitem_to_update.Notes__c = newStatus;
            todoitem_to_update.Subject__c = subjectArg;

            update todoitem_to_update;
            
            return todoitem_to_update;
        
    }

    @AuraEnabled
    public static void deleteToDoItem(String id){
        To_Do_Item__c itemToDelete = [SELECT id FROM To_Do_Item__c WHERE id = :id];

        delete itemToDelete;
    }


    @AuraEnabled
    public static void createNewToDoItem(String subjectArg, Date dateArg, String statusArg, String priorityArg){
        To_Do_Item__c itemToInsert = new To_Do_Item__c();
        itemToInsert.Subject__c = subjectArg;
        itemToInsert.Due_Date__c = dateArg;
        itemToInsert.Status__c = statusArg;
        itemToInsert.Priority__c = priorityArg;

        insert itemToInsert;
    }

    @AuraEnabled
    public static To_Do_Item__c getToDoItemRecord(String idArg){
        try {

            To_Do_Item__c itemToReturn = [SELECT id, Subject__c, Priority__c, Due_Date__c, Notes__c, Status__c FROM To_Do_Item__c WHERE id = :idArg];
            return itemToReturn; 
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}
