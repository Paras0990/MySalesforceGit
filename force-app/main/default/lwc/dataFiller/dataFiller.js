import { LightningElement } from 'lwc';
export default class DataFiller extends LightningElement {

    name;
    phone;
    country;

    rows=[];
    
    handleChange(event){
        const field=event.target.name;
        const value=event.target.value;

        console.log('Field:',field);
        console.log('Value:',value);

        if(field === 'name'){   
            this.name=value;

        }
        else if (field === 'phone'){
            this.phone=value;
        }
        else if (field === 'country'){
            this.country=value;
        }

        console.log("NAME:",this.name);
        console.log("Phone:",this.phone);
        console.log("Country:",this.country);

    }

    handlePassData(){
        console.log('<---Inside Handle Data--->')
        if(this.name && this.phone && this.country){
            const newRow={
                Id:Date.now().toString(),
                Name:this.name,
                Phone:this.phone,
                Country:this.country
            };

            this.rows=[...this.rows,newRow];
            console.log('Rows:',this.rows)

            this.name = '';
            this.phone = '';
            this.country = '';
        }
    }






}