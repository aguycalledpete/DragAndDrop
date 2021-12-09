import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DragAndDropDirective } from './directives/drag-and-drop/drag-and-drop.directive';
import { FilesListComponent } from './components/files-list/files-list.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ConstantsService } from './services/constants/constants.service';
import { FileService } from './services/file/file.service';

@NgModule({
  declarations: [
    AppComponent,
    DragAndDropDirective,
    FilesListComponent,
    FileUploadComponent
  ],
  providers: [
    ConstantsService,
    FileService
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
