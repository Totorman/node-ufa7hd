import { Component, OnInit } from '@angular/core';

import { AccountInfo } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import { ProfileService } from '../profile.service';
import { Profile } from '../profile';

interface Account extends AccountInfo {
  idTokenClaims?: {
    oid?: string // "oid" claim helps us recognize a user
  }
}

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  profile: Profile = {
    id: "",
    userPrincipalName: "",
    givenName: "",
    surname: "",
    jobTitle: "",
    mobilePhone: "",
    preferredLanguage: "",
    firstLogin: true,
  };

  userExists = false;
  dataSource: any[] = [];
  displayedColumns = ['claim', 'value'];

  constructor(private profileService: ProfileService, private authService: MsalService) { }

  ngOnInit(): void {

    // Our mock database assign user Ids based on MS Graph API account id, which corresponds to the "oid" claim in the id_token
    // visit https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens for more information
    const account: Account = this.authService.instance.getAllAccounts()[0];
    this.getProfile(account.idTokenClaims?.oid!);
  }

  getProfile(id: string): void {
    this.profileService.getProfile(id)
      .subscribe({
        next: (profile: Profile) => {
          this.userExists = true;
          this.profile = profile;
          this.dataSource = Object.entries(this.profile);
        },
        error: (error) => {
          console.log(error)
          this.userExists = false;
        }
      });
  }

  submitProfile(profile: Profile): void {
    this.profileService.postProfile(profile)
      .subscribe({
        next: (profile: Profile) => {
          this.userExists = true;
          this.profile = profile;
          this.dataSource = Object.entries(this.profile);
        },
        error: (error) => {
          console.log(error)
          this.userExists = false;
        }
      })
  }
}
