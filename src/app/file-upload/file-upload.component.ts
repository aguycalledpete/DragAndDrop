import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Observer, of, switchMap } from 'rxjs';
import { FileDto } from '../dtos/file.dto';

const FILE_NOT_FOUND = 'File not found';
const INVALID_FILE = 'Invalid file';
const INVALID_IMAGE = 'Invalid Image';
const INVALID_SIZE = 'Invalid Size';
const MAX_FILE_KBYTES = 100000;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileUploaded: EventEmitter<FileDto> = new EventEmitter();

  fileBeingStored: FileDto;
  progress: number;

  readonly progressSimulationDelay = 300;
  readonly progressSimulationInterval = 300;

  fileDroppedHandler(file: File) {
    this.storeFile(file);
  }

  fileBrowseHandler(event: any) {
    const files = event?.target?.files;
    if (files.length > 1) {
      alert('Please only select one file at a time.');
      return;
    }

    if (files.length === 1) {
      console.log(`You selected 1 file.`);
      const file: File = files[0];
      this.storeFile(file);
      return;
    }

    alert('An error occurred during file browse upload! How did you do that?...');
  }

  fileDeletedHandler() {
    this.fileBeingStored = null;
    this.progress = 0;
  }

  private storeFile(file: File) {
    console.log(`You are storing 1 file.`);

    this.fileBeingStored = new FileDto();
    this.fileBeingStored.File = file;

    of(this.fileBeingStored).pipe(
      switchMap(() => this.validateFile(file))
    )
      .subscribe((validatedFile: FileDto) => {
        this.fileBeingStored = null;
        this.progress = 100;
        this.fileUploaded.emit(validatedFile);
      });
  }

  private validateFile(fileToValidate: File): Observable<FileDto> {
    if (!fileToValidate) {
      return new Observable((observer: Observer<FileDto>) => {
        observer.error({ ErrorMessage: ` File name = ${name} | ${FILE_NOT_FOUND}.` });
      });
    }

    const fileReader = new FileReader();
    const { type, name, size } = fileToValidate;

    return new Observable((observer: Observer<FileDto>) => {
      if (!this.isValidSize(size)) {
        observer.error({ ErrorMessage: ` File name = ${name} | ${INVALID_SIZE}. | Size = ${size} bytes` });
      }

      fileReader.readAsDataURL(fileToValidate);
      fileReader.onload = () => {
        if (this.isImage(type)) {
          const image = new Image();
          image.onload = () => {
            observer.next({ File: fileToValidate });
            observer.complete();
          };

          image.onerror = () => {
            observer.error({ ErrorMessage: ` File name = ${name} | ${INVALID_IMAGE}.` });
          };

          image.src = fileReader.result as string;
          return;
        }

        observer.next({ File: fileToValidate });
        observer.complete();
      };

      fileReader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          this.progress = parseInt(progress.toFixed());
          console.log(`Progress = ${this.progress.toFixed()}%.`);
        }
      };

      fileReader.onerror = () => {
        observer.error({ ErrorMessage: ` File name = ${name} | ${INVALID_FILE}.` });
      };

    });
  }

  private isValidSize(size: number): boolean {
    const toKByte = size / 1000;
    return toKByte >= 5 && toKByte <= MAX_FILE_KBYTES;
  }

  private isImage(mimeType: string): boolean {
    return mimeType.match(/image\/*/) !== null;
  }

}
