import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartProducts: any[] = [];
  loader:boolean = false

  public totalItems: number = 0;
  public totalPrice: number = 0;

  constructor(
    public db: DbService,
    private toast: ToastrService,
    private change: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.db.cartsSub.subscribe((list) => {
      if(list.length !== 0) {
        this.cartProducts = list;
        // this.calculate();
      }
    })
  }
  
  deleteItem(id: any){
    this.loader = true;
    
    // BaseUrls.getDeleteUthi\
    this.http.get(`${BaseUrls.getDeleteUrl(BaseUrls.INTEREST_GROUPURL)}/${id}`)
    .toPromise()
    .then(() => {
      this.toast.success("Request Deleted Successfully")
      let idx = this.cartProducts.findIndex((x) => x.carId == id);
      this.cartProducts.splice(idx,1);
      this.loader = false;
      // this.modalService.dismissAll();
    })
    .catch((err) => {
      this.loader = false;
      this.toast.warning("Something went wrong. Please try again later!")
    })
  }

}
