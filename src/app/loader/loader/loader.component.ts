import { Component } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  loader: any = false;

  constructor(private loaderSErvice: LoaderService) {
    this.loaderSErvice.getLoading().subscribe((res: any) => {
      this.loader = res;
    });
  }
}
