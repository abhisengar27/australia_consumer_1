import { Routes } from "@angular/router";

import { DocumentsUpload } from "./docsUpload.component";
// import {Application} from "./app.application";

export const DOC_UPLOAD_CHILD_ROUTES: Routes = [
    { path: '', redirectTo: 'Passport', pathMatch: 'full' },
    { path: 'Passport', component: DocumentsUpload },
    { path: 'Medicare', component: DocumentsUpload },
    { path: 'DrivingLicense', component: DocumentsUpload }
];