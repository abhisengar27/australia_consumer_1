import { Component ,AfterViewInit,OnInit,Input,Output,EventEmitter} from '@angular/core';
import {Router} from '@angular/router'
import { OAOService } from "../../../services/OAO.Service";
declare var jQuery:any;
@Component({
    selector: 'oao-header',
    templateUrl: './oaoHeader.component.html'
    
})
export class oaoHeaderComponent{
	@Output() childFunction: EventEmitter<any> = new EventEmitter<any>();
	@Input('productsData') incomingData: any;
	private logoName:String;
	constructor(private oaoService: OAOService){
		this.oaoService.getLOGO().subscribe((data)=>{
			console.log(data);
			this.logoName=data.logoName;
		},(error)=>{
			console.log(error);
		},()=>{
			console.log("success");
		})
	}
    clear(){
        window.location.href=this.oaoService.baseURL;
        localStorage.clear();
    }
	callChildFunction(value:any){
	console.log("in haedr",value);
	
	this.childFunction.emit({type:value});
	
	}
}