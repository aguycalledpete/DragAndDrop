import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  // ----- File Drag over and away listeners and class binding
  // ----- (triggers animation linked to class)

  @HostBinding('class.fileOver')
  fileOver: boolean = false;

  // Drag over listener
  @HostListener('dragover', ['$event'])
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = true;

    console.log('Drag Over');
  }

  // Drag away listener
  @HostListener('dragleave', ['$event'])
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    console.log('Drag Leave');
  }

  // ----- File dropped event and listener
  // -----

  @Output() onFileDropped = new EventEmitter<File>();

  // Drop listener
  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    const files = event.dataTransfer.files;
    if (files.length > 1) {
      alert('Please only drag and drop one file at a time.');
      return;
    }

    if (files.length === 1) {
      console.log(`You dropped 1 file.`);
      this.onFileDropped.emit(files[0]);
      return;
    }

    alert('An error occurred during file drag and drop upload! How did you do that?...');
  }

  // -----
  // -----
}
