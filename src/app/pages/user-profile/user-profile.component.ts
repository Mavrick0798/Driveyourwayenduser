import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  updation: boolean = false;
  loader: boolean = false;
  user: Users = JSON.parse(localStorage.getItem('user') || '{}');
  userAddress: any[] = [];

  userForm: FormGroup = new FormGroup({
    userId: new FormControl(this.user.userId),
    email: new FormControl(this.user.email),
    password: new FormControl(this.user.password),
    fullName: new FormControl(this.user.fullName),
    image: new FormControl(this.user.image),
    contact: new FormControl(this.user.contact === "null" ? "" : this.user.contact),
    street: new FormControl(this.user.street === "null" ? "" : this.user.street),    
    country: new FormControl(this.user.country === "null" ? "" : this.user.country),    
    city: new FormControl(this.user.city === "null" ? "" : this.user.city),    
    pincode: new FormControl(this.user.pincode === 0 ? "" : this.user.pincode),
    state: new FormControl(this.user.state === "null" ? "" : this.user.state),
    subscriptionName: new FormControl(this.user.subscriptionName  === "null" ? "" : this.user.subscriptionName),
    subscriptionExpiry: new FormControl(this.user.subscriptionExpiry === "null" ? new Date() : new DatePipe('en-us').transform(new Date(this.user.subscriptionExpiry), 'yyyy-MM-dd'))
  });

  userAddressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private toast: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // this.httpClient.get<{data: any[]}>(`${BaseUrls.getUrl(BaseUrls.USER_ADDRESS_GROUPURL)}/${this.user.userId}/addresses`)
    //   .subscribe({
    //     next: ({ data }) => {
    //       this.userAddress = data;
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     }
    //   })
  }

  saveRestaurant() {
    this.loader = true;
    let values = { ...this.userAddressForm.value };
    
    let formData = new FormData();
    Object.entries(values).forEach(([key, value]: [string, any], idx: number) => formData.append(key, value))
    
    if(!this.updation) {
      this.httpClient.post<{ data: any[] }>(BaseUrls.getAddUrl(BaseUrls.USER_ADDRESS_GROUPURL), formData)
      .subscribe({
        next: ({ data }) => {
          this.loader = false;
          this.userAddress.push(data[0]);
          this.toast.success("User Address Added", "Success");
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.log(error);
          
          this.loader = false;
          this.toast.warning("Something went wrong!!", "Failed")
        }
      })
    } else {
      this.httpClient.post<{ data: any[] }>(BaseUrls.getUpdateUrl(BaseUrls.USER_ADDRESS_GROUPURL), formData)
      .subscribe({
        next: ({ data }) => {
          this.loader = false;
          this.userAddress[this.userAddress.findIndex(x => x.addressId === data[0].addressId)] = { ...data[0] }
          this.toast.success("User Address Updated", "Success");
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.log(error);
          
          this.loader = false;
          this.toast.warning("Something went wrong!!", "Failed")
        }
      })
    } 
  }

  deleteUserAddress(addressId: number, idx) {
    this.httpClient.get<{ data: any[] }>(`${BaseUrls.getDeleteUrl(BaseUrls.USER_ADDRESS_GROUPURL)}/${addressId}`)
      .subscribe({
        next: ({ data }) => {
          this.loader = false;
          this.userAddress.splice(idx, 1)
          this.toast.success("User Address Updated", "Success");
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.log(error);
          
          this.loader = false;
          this.toast.warning("Something went wrong!!", "Failed")
        }
      })
  }

  updateProfile() {
    this.loader = true;
    let formData: FormData = new FormData();
    Object.entries(this.userForm.value).forEach(([key, value]: [string, any], idx: number) => {
      if(key === "subscriptionExpiry") {
        formData.append(key, new Date(value).toLocaleString());
        return
      }
      formData.append(key, value);
    });

    this.httpClient.post(BaseUrls.getUpdateUrl(BaseUrls.USER_GROUPURL), formData)
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.loader = false;
          localStorage.setItem("user", JSON.stringify(data[0]));
          this.toast.success("Profile Updated", "Success")
        },
        error: (error) => {
          // console.log(error);
          this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
          this.loader = false;
        },
      })
  }
}
