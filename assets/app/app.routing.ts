import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/commonComponents/loginDetails/login.component";
import { LogoutComponent } from "./components/commonComponents/loginDetails/logout.component";
import { DashboardComponent } from "./components/commonComponents/loginDetails/dashboard.component";

import { HomeComponent } from "./components/home.component";
import { office365 } from "./components/office365.component";
import { SingleJointComponent } from "./components/commonComponents/SingleJoint.component";
import { PersonalDetailsBasicComponent } from "./components/commonComponents/personalDetails/personalDetailsBasic.component";
import { PersonalDetailsContactComponent } from "./components/commonComponents/personalDetails/personalDetailsContact.component";
import { TaxInformationComponent } from "./components/commonComponents/personalDetails/taxInformation.component";
import { PasswordSetupComponent } from "./components/commonComponents/passwordSetup.component";
import { OnlineIdCheckComponent } from "./components/commonComponents/onlineIdCheck.component";
import { CompleteInformationComponent } from "./components/completeInformation.component";

import { AssetsComponent } from "./components/commonComponents/loanDetails/assets.component";
import { AboutYouComponent } from "./components/commonComponents/loanDetails/aboutYou.component";
import { IncomeExpenseComponent } from "./components/commonComponents/loanDetails/incomeExpense.component";
import { PropertyDetailsComponent } from "./components/homeLoan/propertyDetails.component";
import { LoanDetailsComponent } from "./components/homeLoan/loanDetails.component";
import { LoanSummaryComponent } from "./components/homeLoan/loanSummary.component";
import { PersonalLoanComponent } from "./components/personalLoan/personalLoan.component";
import { AuthGuard } from "./AuthGuard";
import { DocumentsUpload } from "./components/commonComponents/docsUpload/docsUpload.component";
import {DOC_UPLOAD_CHILD_ROUTES} from "./components/commonComponents/docsUpload/docsUpload.child.routing";
import {CrossSellTerms} from "./components/commonComponents/crossTerms";
import {ExpenseComponent}  from './components/commonComponents/loanDetails/expensegraph.component'

import {DocumentCheck} from "./components/commonComponents/documentCheck.component";
import {DrivingLicenseInfo} from "./components/commonComponents/drivingLicenseInfo.component";
import {FillWithFacebook} from "./components/commonComponents/fillWithFacebook.component";
import { JointApplicantComponent } from "./components/commonComponents/jointAccountDetails/jointPersonalDetails.component";
import { JOINTACCOUNT_ROUTES } from "./components/commonComponents/jointAccountDetails/jointAccount.routes";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'completeInformation', component: CompleteInformationComponent, children: [
       { path: '', redirectTo: 'singleJoint'},
       { path: 'singleJoint', component: SingleJointComponent},
       { path: 'personalBasicInfo', component: PersonalDetailsBasicComponent},
       { path: 'personalContactInfo', component: PersonalDetailsContactComponent},
       { path: 'taxInformation', component: TaxInformationComponent},
       { path: 'onlineIdCheck', component: OnlineIdCheckComponent,children: DOC_UPLOAD_CHILD_ROUTES},
       { path: 'passwordSetup', component: PasswordSetupComponent},
       { path: 'propertyDetails', component: PropertyDetailsComponent },
       { path: 'loanDetails', component: LoanDetailsComponent },
       { path: 'loanSummary', component: LoanSummaryComponent },
       { path: 'incomeExpense', component: IncomeExpenseComponent },
       { path: 'assets', component: AssetsComponent },
       { path: 'aboutYou', component: AboutYouComponent },
       { path: 'jointApplicants', component: JointApplicantComponent ,children: JOINTACCOUNT_ROUTES},
       { path: 'personalLoanDetails', component: PersonalLoanComponent },
       {path : 'expense_graph',component:ExpenseComponent},
       { path: 'documentCheck', component: DocumentCheck },
       { path: 'drivingLicenseInfo', component: DrivingLicenseInfo },
         { path: 'fillWithFacebook',component: FillWithFacebook}

    ]},
	{ path: 'office365/:token', component: office365 },
    { path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
     
         {path: 'campaign',component:HomeComponent},
     
    { path: 'home/:appid', component: HomeComponent },
	{ path: 'home/:adminid/:appid', component: HomeComponent },
	{ path: 'home/:prod_type/:CampID', component: HomeComponent },
    { path: 'login', component: LoginComponent }, 
	{ path: 'logout', component: LogoutComponent }, 
    { path: 'dashboard', component: DashboardComponent }, 
     { path: 'singleJoint', component:SingleJointComponent}  , 
    { path: 'personalBasicInfo', component: PersonalDetailsBasicComponent },
    { path: 'personalContactInfo', component: PersonalDetailsContactComponent},
    { path: 'taxInformation', component: TaxInformationComponent},
    { path: 'passwordSetup', component: PasswordSetupComponent},
    { path: 'onlineIdCheck', component: OnlineIdCheckComponent},

    { path: 'propertyDetails', component: PropertyDetailsComponent },
    { path: 'loanDetails', component: LoanDetailsComponent },
    { path: 'loanSummary', component: LoanSummaryComponent },
    { path: 'incomeExpense', component: IncomeExpenseComponent },
    { path: 'assets', component: AssetsComponent },
    { path: 'personalLoanDeatils', component: PersonalLoanComponent },
    {path:'crossSellTerms',component:CrossSellTerms}



];
export const routing = RouterModule.forRoot(APP_ROUTES);
