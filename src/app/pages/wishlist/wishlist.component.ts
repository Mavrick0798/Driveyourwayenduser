import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BaseUrls } from 'src/app/base-urls';
import { Orders } from 'src/app/models/orders';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlists: any[] = [];
  loader: boolean = false;

  constructor(
    private db: DbService,
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.db.getWishlist();
    this.db.wishlistSub.subscribe((list) => {
      if(list.length !== 0) {
        this.wishlists = list.map(e => ({
          ...e.car,
          ...e.wishlist
        }))
      }
    })
    // this.orderObservable = this.httpClient.get<any[]>("assets/json/orders.json");
  }

  deleteItem(id: any){
    this.loader = true;
    
    // BaseUrls.getDeleteUthi\
    this.http.get(`${BaseUrls.getDeleteUrl(BaseUrls.WISHLIST_GROUPURL)}/${id}`)
    .toPromise()
    .then(() => {
      let idx = this.wishlists.findIndex((x) => x.carId == id);
      this.wishlists.splice(idx,1);
      this.loader = false;
      this.toast.success("Removed Successfully")
    })
    .catch((err) => {
      this.loader = false;
      this.toast.warning("Something went wrong. Please try again later!")
    })
  }

}
