import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.scss']
})
export class BrowsePageComponent implements OnInit {

  links = [
    { label: `Browse Users`, path: ['/', 'browse', 'users'] },
    { label: `Browse Pulses`, path: ['/', 'browse', 'pulses'] },
    { label: `Browse CheckPoints`, path: ['/', 'browse', 'checkpoints'] },
    // { label: `Browse Conversations`, path: ['/', 'browse', 'conversations'] },
    // { label: `Browse Watches`, path: ['/', 'browse', 'watches'] },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
