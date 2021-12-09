import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDto as FileDto } from '../dtos/file.dto';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent {
  @Input() public files: Array<FileDto> = new Array<FileDto>();

  // ----- Calculate and return formatted file size.
  // ----- 

  readonly dataUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  readonly fileSizeDecimals = 2;

  getFormattedFileSize(bytes: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    let dataUnitIndex = Math.floor(Math.log(bytes) / Math.log(1000));
    if (dataUnitIndex > this.dataUnits.length) {
      dataUnitIndex = this.dataUnits.length - 1;
    }

    const fileSize = parseFloat((bytes / Math.pow(1000, dataUnitIndex)).toFixed(this.fileSizeDecimals));
    return `${fileSize} ${this.dataUnits[dataUnitIndex]}`;
  }

  // ----- Event emitter
  // ----- 

  @Output() fileDeleted = new EventEmitter<any>();

  deleteFile(index: number) {
    const fileToDelete = this.files[index];
    this.fileDeleted.emit(fileToDelete);
  }
}
