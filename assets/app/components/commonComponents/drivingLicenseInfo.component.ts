import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOService } from "../../services/OAO.Service";
import { PersonalDetailsObject } from "../../interfaces/personalDetails.interface";
declare var jQuery: any;
@Component({
    selector: 'dl-info',
    templateUrl: './drivingLicenseInfo.component.html'
})
export class DrivingLicenseInfo implements OnInit {

    public urlString: any;
    public applicantType: string;
    public applicantTypeNormalFunc: string;
    public product_type: string;
    public product_code: string;
    public prod_code: string;
    public prod_code_sec_app: string;
    public prod_name_sec_app: string;
    private config: any;
    private docType: string = "DrivingLicense";
    private appId: string;
    private uploadingFileName = "File_" + Date.now() + (Math.floor((Math.random() * 100))) + '.jpg';
    private model: PersonalDetailsObject = new PersonalDetailsObject('', '', '', '', '', '', '');
    private isRouteChange: boolean = false;
    private txtDLInput: string;

    private passportCheck: string;
    private licenseCheck: string;
    private medicareCheck: string;
    private is_docUpload: boolean;
    private imagePath: string;
    private dlUploadStatus: boolean = true;
    private dlNumber: string;

    constructor(private oaoservice: OAOService, private chRef: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {
        this.urlString = this.router.url;
        var componenturl: string[] = this.urlString.split('/');
        this.applicantType = componenturl[3];
        this.applicantTypeNormalFunc = componenturl[2];
        console.log(" sample check \t" + this.applicantType);
        console.log("drivingLicenseInfo  constructor()");
        this.model = this.oaoservice.getPersonalDetailsObject();
        this.prod_code = this.model.product_type_code;
        this.prod_code_sec_app = this.model.product_code;
        this.prod_name_sec_app = this.model.product_name;
        if (this.applicantType == "drivingLicenseInfo") {
            this.model = this.oaoservice.getPersonalDetailsObject();
        } else if (this.applicantType == "drivingLicenseInfoTwo") {
            this.model = this.oaoservice.getJointPersonalDetailsObject();
            this.model.singleORjoint = "joint";
            this.model.product_type_code = this.prod_code;
            this.model.product_code = this.prod_code_sec_app;
            this.model.product_name = this.prod_name_sec_app;
        } else {
            this.model = this.oaoservice.getPersonalDetailsObject();
        }
        console.log('Model', this.model);
        this.txtDLInput = null;
        this.appId = this.model.app_id || this.model.application_id;
        this.config = {
            thumbnailHeight: 70,
            url: "api/scan/dl",
            headers: { "app_id": this.appId, "id_type": "Driving" },
            previewTemplate: `<div class="dz-preview dz-file-preview" style="padding:0px !important">
                          <a  href="javascript:void(0);" title="Change uploaded file" style="z-index:50;position:absolute;right:0%;background-color:white;" data-dz-remove ><span class="glyphicon glyphicon-edit"></span></a>
                        <div class="dz-image"><img id="img_dl"data-dz-thumbnail /></div>
                        <div class="dz-details">
                          <div class="dz-size"><span data-dz-size></span></div>
                          <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><img style="margin-left:25%;height:60%;position:relative;width:40%;margin-top:10%" src="/assets/images/Details_fetching_aadhaar.gif"></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark">
                          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>Check</title>
                            <defs></defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                              <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
                            </g>
                          </svg>
                        </div>
                        <div class="dz-error-mark">
                          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>Error</title>
                            <defs></defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                              <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
                                <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>`
        };
    }

    removeFile(event) {
        jQuery('.dlErrorInfo').hide();
        jQuery('#txtDLInput').removeClass('loadinggif');
        jQuery('#txtDLInput').val(' ');
        jQuery('.onlineError').hide();
        localStorage.setItem("DLNumber", "");
        jQuery('#theImg').hide();
        this.txtDLInput = null;

    }

    hideScan() {
        this.dlUploadStatus = true;
    }

    addedFile() {
        jQuery('#txtDLInput').addClass('loadinggif');
    }
    drivingLicenseDetails(data) {
        var res = data[1];
        console.log('Result', res);
        var ocrData = JSON.stringify(res.payload);
        if (res.status) {
            jQuery('#txtDLInput').removeClass('loadinggif');
            this.model.drivinglicense = res.payload.license_number;
            this.model.dlimagePath = res.payload.image_path;
            this.chRef.detectChanges();
            jQuery('#btnProceed').prop('disabled', false);
            jQuery('#btnProceed').attr('data-ocr', ocrData);
            jQuery('.onlineError').show();

            this.dlNumber = this.model.drivinglicense;
            this.setDataToModel(res.payload);
            this.setAddressToModel(res.payload);
            this.model.is_doc_upload = true;
            this.txtDLInput = this.model.drivinglicense;
                        if (this.applicantType == "drivingLicenseInfo") {
                this.oaoservice.setPersonalDetailsObject(this.model);
            } else if (this.applicantType == "drivingLicenseInfoTwo") {
                this.oaoservice.setJointPersonalDetailsObject(this.model);
            } else {
                this.oaoservice.setPersonalDetailsObject(this.model);
            }
        } else {
            this.model.is_doc_upload = false;
            jQuery('#txtDLInput').removeClass('loadinggif');
            jQuery('.dlErrorInfo').show();

        }
    }

    setAddressToModel(data) {

        this.model.address = data.address.address;
            if (this.applicantType == "drivingLicenseInfo") {
            this.oaoservice.setPersonalDetailsObject(this.model);
        } else if (this.applicantType == "drivingLicenseInfoTwo") {
            this.oaoservice.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoservice.setPersonalDetailsObject(this.model);
        }
    }

    setDataToModel(data) {
        var result = JSON.stringify(data);
        this.model.fname = data.fname;
        this.model.lname = data.lname;
        this.model.mname = "";
        this.model.dob = data.dob;
        this.model.postcode = "3102";
        console.log(data.dob);
        if (this.applicantType == "drivingLicenseInfo") {
            this.oaoservice.setPersonalDetailsObject(this.model);
        } else if (this.applicantType == "drivingLicenseInfoTwo") {
            this.oaoservice.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoservice.setPersonalDetailsObject(this.model);
        }
    }

    ngOnInit() {
        this.imagePath = this.model.dlimagePath;
        if (this.model.dlimagePath != null) {
            this.dlUploadStatus = false;
        }
 jQuery('.dlErrorInfo').hide();
        jQuery('.onlineError').hide();
    }

    ngAfterViewInit() {
    }

    dl_msg() {
        console.log("inside driving license")
    }

    proceedPersonalInfo() {
         if (this.applicantType == "drivingLicenseInfo") {
            this.oaoservice.setPersonalDetailsObject(this.model);
        } else if (this.applicantType == "drivingLicenseInfoTwo") {
            this.oaoservice.setJointPersonalDetailsObject(this.model);
        } else {
            this.oaoservice.setPersonalDetailsObject(this.model);
        }
        this.oaoservice.onlineIdcheck(this.model)
            .subscribe(
            data => {
                if (data.pass == "success" || data.dl == "success" || data.mc == "success") {
                    this.passportCheck = data.pass
                    this.licenseCheck = data.dl
                    this.medicareCheck = data.mc
                    this.model.onlineVerificationStatus = true;

                    jQuery('.onlineError').show();
                }
                else if (data.server == "error") {
                    this.model.onlineVerificationStatus = false;
                    jQuery('.onlineError').show();
                }
                else {
                    this.model.onlineVerificationStatus = false;
                    this.passportCheck = "passport not verified"
                    this.licenseCheck = "Dl not verified"
                    this.medicareCheck = "medicare not verified"
                    jQuery('.onlineError').show();
                }
            }
            );

    }
    moveBack() {
        this.isRouteChange = true;
        if (this.applicantType == "drivingLicenseInfoTwo") {
            this.router.navigate(['../drivingLicenseInfo'], { relativeTo: this.route });
        }
    }
    dlManualInput() {

        jQuery('#btnProceed').prop('disabled', false);

    }
    skipVerification() {
           if (this.applicantType == "drivingLicenseInfo") {
            this.router.navigate(['../drivingLicenseInfoTwo'], { relativeTo: this.route });
        } else if (this.applicantType == "drivingLicenseInfoTwo") {
            this.router.navigate(['../applicantOneComponent'], { relativeTo: this.route });
        } else {
            this.router.navigate(['../personalBasicInfo'], { relativeTo: this.route });
        }
    }
}
