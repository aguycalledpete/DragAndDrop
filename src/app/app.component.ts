import { Component } from '@angular/core';
import { FileDto } from './dtos/file.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  storedFiles: Array<FileDto> = new Array<FileDto>();

  fileUploadedHandler(storedFile: FileDto) {
    this.storedFiles.push(storedFile);
    console.log(`You have uploaded a file`);
  }

  fileDeletedHandler(index: number) {
    this.storedFiles.splice(index, 1);
  }

}
