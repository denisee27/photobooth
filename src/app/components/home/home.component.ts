import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  trigger$: Subject<void> = new Subject<void>();
  images: { img: WebcamImage, show: boolean, bgColor: string }[] = [];
  countdown: number = 0;
  showPreview: boolean = false;
  showPleaseWait: boolean = false;
  layout: string = 'vertical'; // Default layout
  previewBgColor: string = '#ffffff'; // Warna default
  availableColors: string[] = ['#ffffff', '#ffcccc', '#ccffcc', '#ccccff'];

  startCapture(): void {
    this.images = []; // Reset images
    this.countdown = 3;
    this.showPreview = false;
    this.showPleaseWait = false;
    this.capturePhoto(4);
  }

  private capturePhoto(times: number): void {
    if (times > 0) {
      this.countdown = 3;
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(interval);
          this.trigger$.next();
          setTimeout(() => {
            if (times - 1 === 0) {
              this.showPleaseWait = true;
              setTimeout(() => {
                this.showPleaseWait = false;
                this.showPreview = true;
              }, 2000);
            } else {
              this.capturePhoto(times - 1);
            }
          }, 500);
        }
      }, 1000);
    }
  }

  handleImage(webcamImage: WebcamImage): void {
    if (webcamImage) {
      const newImage = { img: webcamImage, show: false, bgColor: '#ffffff' };
      this.images.push(newImage);
      setTimeout(() => {
        newImage.show = true;
      }, 100);
    }
  }

  handleInitError(error: WebcamInitError): void {
    console.error('Webcam error:', error);
  }

  changePreviewBgColor(color: string): void {
    this.previewBgColor = color;
  }

  changeLayout(layout: string): void {
    this.layout = layout;
  }

}
