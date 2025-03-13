import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
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
  today = new Date();
  take: boolean = false;
  selectedLayout: any = 'vertical';
  showPreview: boolean = false;
  previewBgColor: string = '#ffffff';
  availableColors: string[] = ['#ffffff', '#ffcccc', '#ccffcc', '#ccccff'];

  startCapture(): void {
    this.images = [];
    this.take = true;
    this.countdown = 3;
    this.showPreview = false;
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
            this.capturePhoto(times - 1);
          }, 500);
        }
      }, 1000);
    }
  }


  downloadPreview() {
    const element = document.getElementById('photo-preview');
    // Tampilkan sementara
    element!.classList.remove('d-none');

    // Tunggu sejenak agar html2canvas bisa menangkap elemen yang baru tampil
    setTimeout(() => {
      html2canvas(element!, { scrollY: -window.scrollY }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'photo-preview.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(error => console.error('Failed to download image:', error))
        .finally(() => {
          // Sembunyikan lagi setelah selesai
          element!.classList.add('d-none');
        });
    }, 100);
  }





  preview() {
    this.showPreview = true;
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

}
