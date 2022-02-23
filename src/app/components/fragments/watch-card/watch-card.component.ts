import { Component, Input, OnInit } from '@angular/core';
import { IWatch } from 'src/app/interfaces/watch.interface';

@Component({
  selector: 'app-watch-card',
  templateUrl: './watch-card.component.html',
  styleUrls: ['./watch-card.component.scss']
})
export class WatchCardComponent implements OnInit {
  @Input() watch: IWatch;

  constructor() { }

  ngOnInit(): void {
  }

}
