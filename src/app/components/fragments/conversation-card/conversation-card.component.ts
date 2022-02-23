import { Component, Input, OnInit } from '@angular/core';
import { IConversation } from 'src/app/interfaces/conversation.interface';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss']
})
export class ConversationCardComponent implements OnInit {
  @Input() conversation: IConversation;

  constructor() { }

  ngOnInit(): void {
  }

}
