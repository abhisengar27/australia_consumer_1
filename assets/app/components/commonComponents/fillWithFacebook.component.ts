import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOService } from "../../services/OAO.Service";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
declare var jQuery: any;
@Component({
    selector: 'fill-with-facebook',
    templateUrl: './fillWithFacebook.component.html'
})
export class FillWithFacebook implements OnInit {


    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private isLoading: boolean = false;

    constructor(private oaoservice: OAOService, private router: Router, private route: ActivatedRoute, private fb: FacebookService) {
        this.model = this.oaoservice.getPersonalDetailsObject();
    }
    ngOnInit() {

    }
    private handleError(error) {
        console.error('Error processing action', error);
    }

    fillwithFB() {
        console.log('Initializing Facebook');
        this.fb.login()
            .then((res: LoginResponse) => {
                console.log('Logged in', res);
                //to get profile data
                this.fb.api('/me', 'get', { fields: ['first_name', 'last_name', 'birthday', 'id', 'email', 'location'] })
                    .then((res: any) => {
                        console.log('Got the users profile', res);
                        if (res.first_name == null) { } else { this.model.fname = res.first_name; }
                        if (res.last_name == null) { } else { this.model.lname = res.last_name; }
                        if (res.email == null) { } else { this.model.email = res.email; }
                        if (res.birthday == null) { } else { this.model.dob = res.birthday; }
                        if (res.location == null) { } else { this.model.address = res.location; }
                        this.oaoservice.setData(this.model);
                        this.GoToPersonalBasicInfo();

                    })
                    .catch(this.handleError);
            })
            .catch(this.handleError);
    }

    backToDocumentCheck() {
        this.router.navigate(["../documentCheck"], { relativeTo: this.route });
    }
    GoToPersonalBasicInfo(){
         this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
    }

}