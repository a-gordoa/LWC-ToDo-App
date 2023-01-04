import { LightningElement } from "lwc";

export default class App extends LightningElement {
  bear = {
    Name: "Anthony",
    Weight__c: "123",
    Age__c: "23",
    Sex__c: 'Male',
    Height__c: "23"
  }

  testData = {
    Subject__c: "Task Title",
    Status__c: "In Progress",
    Account__c:'001Dn000004qx4dIAA',
    Notes__c: "Still working, but will be done soon",
    Due_Date__c: "2022-01-23",
    Priority__c: 'Normal',
    CreatedById: '005Dn000001I66XIAS',
    Id: 'a01Dn000008hSkgIAE',
    Name: 'ToDo-0001'
  }

  // testData = {
  //   Subject: "Task Title",
  //   Status: "In Progress",
  //   WhatId:'001Dn000004qx4dIAA',
  //   Description: "Still working, but will be done soon",
  //   ActivityDate: "2022-01-23",
  //   Priority: 'Normal',
  //   OwnerId: '005Dn000001I66XIAS',
  //   Id: '00TDn000008LqGUMA0'
  // }
}