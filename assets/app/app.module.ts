import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from "./app.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { LaddaModule } from 'angular2-ladda';
import { Md2Module } from 'md2';
import { DatePipe } from '@angular/common';
import {GooglePlaceModule} from 'ng2-google-place-autocomplete';
import { FacebookModule } from 'ng2-facebook-sdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MedicareValidator} from './validators/medicare_validator';
import { SplitValidator } from './validators/fixedandvariable';
import { FirstNameValidator } from './validators/namevalidator';
import { AlphanumericValidator } from './validators/alphanumeric_validator';
import { MobileNumberValidator } from './validators/mob_number';
import { EmailValidator } from './validators/email_validator';
import { TFNValidator } from './validators/tfnvalidator';
import { PassportValidator } from './validators/passport_validator';
import { DrivingLicenceValidator } from './validators/Driving_licence_validator';
import { dobvalidator } from './validators/dob_validator';
import { Common } from './validators/commonFunc';

import { AppComponent } from "./app.component";
import {OAOService} from "./services/OAO.Service";
import { oaoHeaderComponent } from "./components/commonComponents/headerFooter/oaoHeader.component";
import { oaoFooterComponent } from "./components/commonComponents/headerFooter/oaoFooter.component";

import { LoginComponent } from "./components/commonComponents/loginDetails/login.component";
import { LogoutComponent } from "./components/commonComponents/loginDetails/logout.component";
import { DashboardComponent } from "./components/commonComponents/loginDetails/dashboard.component";
import { HomeComponent } from "./components/home.component";
import { SingleJointComponent } from "./components/commonComponents/SingleJoint.component";
import { PersonalDetailsBasicComponent } from "./components/commonComponents/personalDetails/personalDetailsBasic.component";
import { PersonalDetailsContactComponent } from "./components/commonComponents/personalDetails/personalDetailsContact.component";
import { TaxInformationComponent } from "./components/commonComponents/personalDetails/taxInformation.component";
import { PasswordSetupComponent } from "./components/commonComponents/passwordSetup.component";
import { OnlineIdCheckComponent } from "./components/commonComponents/onlineIdCheck.component";
import { CompleteInformationComponent } from "./components/completeInformation.component";
import { FileSelectDirective, FileDropDirective,FileUploader } from 'ng2-file-upload';//file upload
import { AssetsComponent } from "./components/commonComponents/loanDetails/assets.component";
import { AboutYouComponent } from "./components/commonComponents/loanDetails/aboutYou.component";
import { IncomeExpenseComponent } from "./components/commonComponents/loanDetails/incomeExpense.component";
import { PropertyDetailsComponent } from "./components/homeLoan/propertyDetails.component";
import { LoanDetailsComponent } from "./components/homeLoan/loanDetails.component";
import { LoanSummaryComponent } from "./components/homeLoan/loanSummary.component";
import { PersonalLoanComponent } from "./components/personalLoan/personalLoan.component";
import { RecaptchaModule } from 'ng-recaptcha';
import { DocumentsUpload } from "./components/commonComponents/docsUpload/docsUpload.component";
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { office365 } from "./components/office365.component";
import { AuthGuard } from "./AuthGuard";
import { JointApplicantComponent } from "./components/commonComponents/jointAccountDetails/jointPersonalDetails.component";
import {CrossSellTerms} from './components/commonComponents/crossTerms';
import {GoogleAnalyticsEventsService} from './services/GoogleAnalyticsEvents.Service';
import {CalculatorComponent} from './components/commonComponents/loanDetails/calculator.component';
import {ExpenseComponent}  from './components/commonComponents/loanDetails/expensegraph.component'
import {ChartsModule} from 'ng2-charts';import {DocumentCheck} from "./components/commonComponents/documentCheck.component";
import {DrivingLicenseInfo} from "./components/commonComponents/drivingLicenseInfo.component";
import { YearValidator } from './validators/yearvalidator';
import {FillWithFacebook} from "./components/commonComponents/fillWithFacebook.component";
export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}
//Pipes
import {ObjectToArray} from "./pipes/objectToArray.pipe";
import {CapitalizePipe} from "./pipes/objectToArray.pipe";

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
    declarations:
        [
            AppComponent,
            oaoHeaderComponent,
            oaoFooterComponent,
            DocumentsUpload,
            LoginComponent,
			LogoutComponent,
            DashboardComponent,
            HomeComponent,
            SingleJointComponent,
            PersonalDetailsBasicComponent,
            PersonalDetailsContactComponent,
            TaxInformationComponent,
            PasswordSetupComponent,
            OnlineIdCheckComponent,
            FileSelectDirective,
            AssetsComponent,
            AboutYouComponent,
            IncomeExpenseComponent,
            ExpenseComponent,
            PropertyDetailsComponent,
            LoanDetailsComponent,
            LoanSummaryComponent,
            PersonalLoanComponent,
            CalculatorComponent,
	    JointApplicantComponent,
            FirstNameValidator,
            AlphanumericValidator,
            MobileNumberValidator,
            EmailValidator,
            PassportValidator,
            DrivingLicenceValidator,
            dobvalidator,
            SplitValidator,
            TFNValidator,
            MedicareValidator,
            CompleteInformationComponent,
			office365,
            ObjectToArray,
            CapitalizePipe,
            CrossSellTerms,
            DocumentCheck,
            DrivingLicenseInfo,
            YearValidator,
            FillWithFacebook
		] ,
    imports: [
        RecaptchaModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        FacebookModule,
        GooglePlaceModule,
        ChartsModule,
		Md2Module.forRoot() ,
        LaddaModule.forRoot({
            style: "contract",
            spinnerSize: 40,
            spinnerColor: "grey",
            spinnerLines: 12
        }),
         TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
        DropzoneModule.forRoot(DROPZONE_CONFIG)
        ] ,
    providers:[OAOService,Common,DatePipe,AuthGuard,GoogleAnalyticsEventsService],
    bootstrap: [AppComponent]
})
export class AppModule {}
