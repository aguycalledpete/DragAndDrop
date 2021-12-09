import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Observer, of, switchMap } from 'rxjs';
import { ConstantsService } from '../../services/constants/constants.service';
import { FileDto } from '../../dtos/file.dto';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileUploaded: EventEmitter<FileDto> = new EventEmitter();

  fileBeingStored: FileDto;
  progress: number;

  constructor(
    private constants: ConstantsService,
    private fileService: FileService
  ) { }

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
    this.reset();
  }

  private storeFile(file: File) {
    console.log(`You are storing 1 file.`);

    this.fileBeingStored = new FileDto();
    this.fileBeingStored.File = file;

    of(this.fileBeingStored).pipe(
      switchMap(() => this.validateFile(file))
    )
      .subscribe({
        next: (validatedFile: FileDto) => this.fileUploaded.emit(validatedFile),
        error: (invalidFile: FileDto) => alert(invalidFile.ErrorMessage),
        complete: () => this.reset()
      })
  }

  private validateFile(fileToValidate: File): Observable<FileDto> {
    if (!fileToValidate) {
      return new Observable((observer: Observer<FileDto>) => {
        observer.error({ ErrorMessage: `File name = ${name} | ${this.constants.FILE_NOT_FOUND}` });
      });
    }

    const fileReader = new FileReader();
    const { type, name, size } = fileToValidate;

    return new Observable((observer: Observer<FileDto>) => {
      if (!this.isValidSize(size)) {
        this.reset();
        observer.error({ ErrorMessage: `File name = ${name} | ${this.constants.INVALID_SIZE} | Size = ${this.fileService.getFormattedFileSize(size)}` });
        return;
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
            observer.error({ ErrorMessage: `File name = ${name} | ${this.constants.INVALID_IMAGE}` });
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
        observer.error({ ErrorMessage: `File name = ${name} | ${this.constants.INVALID_FILE}` });
      };

    });
  }

  private isValidSize(size: number): boolean {
    const toKByte = size / 1000;
    return toKByte >= 5 && toKByte <= this.constants.MAX_FILE_KBYTES;
  }

  private isImage(mimeType: string): boolean {
    return mimeType.match(/image\/*/) !== null;
  }

  private reset() {
    this.fileBeingStored = null;
    this.progress = 0;
  }

}
