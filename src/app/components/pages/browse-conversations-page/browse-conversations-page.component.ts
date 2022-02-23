import { Component, OnInit } from '@angular/core';
import { IConversation } from 'src/app/interfaces/conversation.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { BrowseService } from 'src/app/services/browse.service';
import { ConversationsService } from 'src/app/services/conversations.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-browse-conversations-page',
  templateUrl: './browse-conversations-page.component.html',
  styleUrls: ['./browse-conversations-page.component.scss']
})
export class BrowseConversationsPageComponent implements OnInit {
  recentConversations: IConversation[] = [];
  you: IUser | null;

  membership_requested_map: {[key:string]: boolean} = {};

  constructor(
    private browseService: BrowseService,
    private userStore: UserStoreService,
    private conversationsService: ConversationsService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe({
      next: (you: IUser | null) => {
        this.you = you;
        this.browseService.get_recent_conversations().subscribe({
          next: (response: ServiceMethodResultsInfo<IConversation[]>) => {
            this.recentConversations = response.data!;
            for (const conversation of this.recentConversations) {
              this.checkMembershipRequest(conversation);
            }
          }
        });
      }
    });
  }

  checkMembershipRequest(conversation: IConversation) {
    this.conversationsService.check_user_conversation_member_request(this.you!.id, conversation.id).subscribe({
      next: (response) => {
        this.membership_requested_map[conversation.id] = !!response.data;
      }
    });
  }

  toggleMemberRequest(conversation: IConversation) {
    if (this.membership_requested_map[conversation.id]) {
      // cancel member request
      this.conversationsService.cancel_request_user_conversation_member(this.you!.id, conversation.id).subscribe({
        next: (response) => {
          this.membership_requested_map[conversation.id] = false;
        }
      });
    }
    else {
      // send member request
      this.conversationsService.request_user_conversation_member(this.you!.id, conversation.id).subscribe({
        next: (response) => {
          this.membership_requested_map[conversation.id] = true;
        }
      });
    }
  }
}
