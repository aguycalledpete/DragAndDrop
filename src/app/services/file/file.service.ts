import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  readonly dataUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  readonly fileSizeDecimals = 2;

  constructor() { }

  public getFormattedFileSize(bytes: any): string {
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
}
