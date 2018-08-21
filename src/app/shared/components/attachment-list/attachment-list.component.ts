import {Component, Input, OnInit} from '@angular/core';
import {NetworkingService} from '../../../services/networking.service';
@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.style.css'],
})
export class AttachmentListComponent implements OnInit{
  @Input()
  product: any = null;

  constructor(
    private network: NetworkingService,
  ) {
  }

  ngOnInit() {
    console.dir(this.product);
  }

  attachmentItemClickHandler(event: Event, attachment) {
    this.network.getRequestDownload(`/product-media/${attachment['id']}`)
      .subscribe(
        (blob) => {
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        },
        (error: Error) => {
          console.dir(error);
        }
      );
    // ________________________
    event.preventDefault();
  }
}
