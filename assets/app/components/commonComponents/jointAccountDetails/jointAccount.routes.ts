import { Routes } from "@angular/router";

import { PersonalDetailsBasicComponent } from "../../../components/commonComponents/personalDetails/personalDetailsBasic.component";
// import { ApplicantOneComponent } from "../../../components/commonComponents/jointAccountDetails/applicantOne.component";
// import { ApplicantTwoComponent } from "../../../components/commonComponents/jointAccountDetails/applicantTwo.component";
import { PersonalDetailsContactComponent } from "../../../components/commonComponents/personalDetails/personalDetailsContact.component";
import { TaxInformationComponent } from "../../../components/commonComponents/personalDetails/taxInformation.component";
import { OnlineIdCheckComponent } from "../../../components/commonComponents/onlineIdCheck.component";
import { PropertyDetailsComponent } from "../../../components/homeLoan/propertyDetails.component";
import { LoanDetailsComponent } from "../../../components/homeLoan/loanDetails.component";
import { LoanSummaryComponent } from "../../../components/homeLoan/loanSummary.component";
import { PersonalLoanComponent } from "../../../components/personalLoan/personalLoan.component";
import { AssetsComponent } from "../../../components/commonComponents/loanDetails/assets.component";
import { AboutYouComponent } from "../../../components/commonComponents/loanDetails/aboutYou.component";
import { IncomeExpenseComponent } from "../../../components/commonComponents/loanDetails/incomeExpense.component";
import { ExpenseComponent } from '../../../components/commonComponents/loanDetails/expensegraph.component';
import { DocumentCheck } from "../../../components/commonComponents/documentCheck.component";
import { DrivingLicenseInfo } from "../../../components/commonComponents/drivingLicenseInfo.component";
import {DOC_UPLOAD_CHILD_ROUTES} from "../../../components/commonComponents/docsUpload/docsUpload.child.routing";
import { SingleJointComponent } from "../../../components/commonComponents/SingleJoint.component";
export const JOINTACCOUNT_ROUTES: Routes = [
  { path: '', redirectTo: 'documentCheck' },
  { path: 'singleJoint', component: SingleJointComponent},
  { path: 'applicantOneComponent', component: PersonalDetailsBasicComponent },
  { path: 'applicantTwoComponent', component: PersonalDetailsBasicComponent },
  { path: 'personalContactInfo', component: PersonalDetailsContactComponent },
  { path: 'personalContactInfoTwo', component: PersonalDetailsContactComponent },
  { path: 'taxInformation', component: TaxInformationComponent },
  { path: 'taxInformationTwo', component: TaxInformationComponent },
  { path: 'propertyDetails', component: PropertyDetailsComponent },
  { path: 'loanDetails', component: LoanDetailsComponent },
  { path: 'loanSummary', component: LoanSummaryComponent },
  { path: 'personalLoanDetails', component: PersonalLoanComponent },
  { path: 'onlineIdCheck', component: OnlineIdCheckComponent, children: DOC_UPLOAD_CHILD_ROUTES },
  { path: 'onlineIdCheckTwo', component: OnlineIdCheckComponent, children: DOC_UPLOAD_CHILD_ROUTES },
  { path: 'incomeExpense', component: IncomeExpenseComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'aboutYou', component: AboutYouComponent },
  { path: 'incomeExpenseTwo', component: IncomeExpenseComponent },
  { path: 'assetsTwo', component: AssetsComponent },
  { path: 'aboutYouTwo', component: AboutYouComponent },
  { path: 'expense_graph', component: ExpenseComponent },
  { path: 'documentCheck', component: DocumentCheck },
  { path: 'drivingLicenseInfo', component: DrivingLicenseInfo },
  { path: 'drivingLicenseInfoTwo', component: DrivingLicenseInfo }
];
