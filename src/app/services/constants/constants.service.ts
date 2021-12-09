import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public readonly FILE_NOT_FOUND = 'File not found';
  public readonly INVALID_FILE = 'Invalid file';
  public readonly INVALID_FILE_NOT_IMAGE = 'Invalid file (Not an image file)';
  public readonly INVALID_IMAGE = 'Invalid Image';
  public readonly INVALID_SIZE = 'Invalid Size';
  public readonly MAX_FILE_KBYTES = 100000;

}
