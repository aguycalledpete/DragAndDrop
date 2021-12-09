import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileService } from 'src/app/services/file/file.service';
import { FileDto } from '../../dtos/file.dto';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent {
  @Input() public files: Array<FileDto> = new Array<FileDto>();

  // ----- Calculate and return formatted file size.
  // ----- 


  constructor(
    private fileService: FileService
  ) { }

  getFormattedFileSize(bytes: any) {
    this.fileService.getFormattedFileSize(bytes);
  }

  // ----- Event emitter
  // ----- 

  @Output() fileDeleted = new EventEmitter<any>();

  deleteFile(index: number) {
    this.fileDeleted.emit(index);
  }
}
