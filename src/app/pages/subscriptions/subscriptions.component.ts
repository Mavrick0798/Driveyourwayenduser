import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { Users } from 'src/app/models/users';

class SubscriptionModel {
  subscriptionId: string;
  title: string;
  expiry: string;
}

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  userModel: Users = JSON.parse(localStorage.getItem("user") || "{}")

  subscriptionList: SubscriptionModel[] = [
    {subscriptionId: '1', title: 'Silver', expiry: '3 months'},
    {subscriptionId: '2', title: 'Gold', expiry: '6 months'},
    {subscriptionId: '3', title: 'Platinum', expiry: '12 months'},
  ];

  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }


  purchaseSubscription(sub: SubscriptionModel) {
    let newDate: Date = new Date();
    newDate.setMonth(newDate.getMonth() + (+sub.expiry.split(" ")[0]));

    let formData = new FormData();
    formData.append("userId", this.userModel.userId);
    formData.append("subscriptionName", sub.title)
    formData.append("subscriptionExpiry", newDate.toLocaleString());

    this.http.post<any>(`${BaseUrls.getUpdateUrl(BaseUrls.USER_GROUPURL)}/${this.userModel.userId}/subscription`, formData)
      .subscribe({
        next: ({ data }) => {
          localStorage.setItem("user", JSON.stringify(data[0]))
          this.userModel = data[0];
          
          this.toast.success("Subsciption Purchase Successfully");
        },
        error: (error) => {
          console.log(error);
          this.toast.error("Something went wrong!! Please Try Again")
        }
      });
  }


}
