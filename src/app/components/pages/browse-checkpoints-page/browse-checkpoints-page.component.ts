import { Component, OnInit } from '@angular/core';
import { ICheckpoint } from 'src/app/interfaces/checkpoint.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { BrowseService } from 'src/app/services/browse.service';

@Component({
  selector: 'app-browse-checkpoints-page',
  templateUrl: './browse-checkpoints-page.component.html',
  styleUrls: ['./browse-checkpoints-page.component.scss']
})
export class BrowseCheckpointsPageComponent implements OnInit {
  recentCheckpoints: ICheckpoint[] = [];

  constructor(
    private browseService: BrowseService,
  ) { }

  ngOnInit(): void {
    this.browseService.get_recent_checkpoints().subscribe({
      next: (response: ServiceMethodResultsInfo<ICheckpoint[]>) => {
        this.recentCheckpoints = response.data!;
      }
    });
  }
}
