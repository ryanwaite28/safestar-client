import { Component, OnInit } from '@angular/core';
import { IWatch } from 'src/app/interfaces/watch.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { BrowseService } from 'src/app/services/browse.service';

@Component({
  selector: 'app-browse-watches-page',
  templateUrl: './browse-watches-page.component.html',
  styleUrls: ['./browse-watches-page.component.scss']
})
export class BrowseWatchesPageComponent implements OnInit {
  recentWatches: IWatch[] = [];

  constructor(
    private browseService: BrowseService,
  ) { }

  ngOnInit(): void {
    this.browseService.get_recent_watches().subscribe({
      next: (response: ServiceMethodResultsInfo<IWatch[]>) => {
        this.recentWatches = response.data!;
      }
    });
  }
}
