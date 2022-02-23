import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-page',
  templateUrl: './find-page.component.html',
  styleUrls: ['./find-page.component.scss']
})
export class FindPageComponent implements OnInit {

  links = [
    { label: `Find Users`, path: ['/', 'find', 'users'] },
    // { label: `Find Conversations`, path: ['/', 'find', 'conversations'] },
    // { label: `Find Watches`, path: ['/', 'find', 'watches'] },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
