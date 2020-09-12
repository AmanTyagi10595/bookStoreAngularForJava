import { DomSanitizer } from '@angular/platform-browser';
import { AuthServiceService } from './../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UpdateStorageService } from '../services/update-storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userInfo: any;
  profileForm: FormGroup;
  message: string = "";
  profileImageUrl:string;
  url: any;
  mimeType;
  // file;

  constructor(
    private fb: FormBuilder,
    private service: AuthServiceService,
    private update: UpdateStorageService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.initializeForm()
    this.userDetail();
  }
  userDetail() {
    let user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.profileImageUrl =  `data:image/jpeg;base64,${this.userInfo.profilePhotoUrl.image}`;
      // this.profileImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:${this.userInfo.profilePhotoUrl.contentType};base64,${btoa(this.userInfo.profilePhotoUrl.image)}`);
      this.profileForm.patchValue({
        name: this.userInfo.name,
        email: this.userInfo.emailId,
        phone: this.userInfo.phone,
      })
    }
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      name: [null],
      phone: [null],
      address: [null],
      email: [null],
      myFile: [null],
    });
  }
  updateProfile(obj) {
    this.service.updateProfile(obj).subscribe((response: any) => {
      this.message = "Profile Upadetd";
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(response.msgData));
        let user = JSON.parse(localStorage.getItem('user'));
      }
      // localStorage.setItem("user", JSON.stringify(response.name));
    }, (error: any) => {
      this.message = "Somthing went wrong";
    });
  }
  fileChanged(e){
    // this.file = e.target.files[0];
    this.profileForm.patchValue({
      myFile: e.target.files[0],

    })
    // console.log("Image Url updating")
  }
}
