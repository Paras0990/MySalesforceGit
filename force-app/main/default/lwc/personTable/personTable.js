import { LightningElement,api } from 'lwc';

export default class PersonTable extends LightningElement {
   @api rowParent=[];
   columns=[
    {label:"Name", fieldName:"Name"},
    {label:"Phone", fieldName:"Phone"},
    {label:"Country", fieldName:"Country"}
];
   

    


}