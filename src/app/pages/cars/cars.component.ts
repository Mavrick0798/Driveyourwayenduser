import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { BaseUrls } from 'src/app/base-urls';
import { Car } from 'src/app/models/car';
import { Users } from 'src/app/models/users';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  loader: boolean = false;
  userModel: Users = JSON.parse(localStorage.getItem("user") || "{}");
  interest: any[] = [];

  cars: any[] = [];

  interestFormGroup: FormGroup;
  selectedCarModel: any;

  showCarUserInfoBool: boolean = false;
  userInfo: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public db: DbService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((response: any) => {
      this.getCars(response.categoryId)
    })
  }


  getCars(categoryId: number) {
    this.http.get(`${BaseUrls.getUrl(BaseUrls.CARS_GROUPURL)}/${categoryId}/cars`)
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.cars = data;
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  openInterestModal(modalRef: TemplateRef<unknown>, carModel: any) {
    let bool = this.interest.some(x => x.carId === carModel.carId);
    if(bool) {
      this.toast.warning("Already Submitted the request");
      return;
    } else {
      this.modalService.open(modalRef);
      this.selectedCarModel = { ...carModel };
      this.interestFormGroup = this.fb.group({
        id: [null],
        carId: [carModel.carId],
        buyerUserId: [this.userModel.userId],
        sellerUserId: [carModel.userID],
        proposedPrice: [null],
        message: [null]
      });
    }
    
  }

  saveInterest() {
    this.loader = true;
    let interestObj = { ...this.interestFormGroup.value };
    console.log(interestObj);

    let formData = new FormData();
    Object.entries(interestObj).forEach(([key, value]: [string, any], idx: number) => formData.append(key, value))

    this.http.post(BaseUrls.getAddUrl(BaseUrls.INTEREST_GROUPURL), formData)
      .subscribe(() => {
        this.loader = false;
        this.toast.success("Request Submitted Successfully");
        this.modalService.dismissAll();
      }, (error) => {
        this.loader = false;
        this.toast.error("Something went wrong!! Please Try Again...")
      })
  }

  alreadyExistsInWishlist(carId: number): Promise<boolean> {
    return new Promise(resolve => {
      this.db.wishlistSub.pipe(take(1)).subscribe((value) => {
        let isData = Array.from(value)
          .filter((wish: {car: Car, wishlist: any}, idx: number) => wish.car.carId === carId)
      
        let isExists = isData.length !== 0 ? true : false;
        resolve(isExists);
      }).unsubscribe();
    })
  }

  async addToWishlist(carId: any) {
    // To Prevent Duplicate item in wishlist
    let isAlreadyAddedToWishlist = await this.alreadyExistsInWishlist(carId);
    if(isAlreadyAddedToWishlist) {
      this.toast.warning("Already Added to wishlist", "");
      return;
    }

    let formData = new FormData();
    formData.append("userId", this.userModel.userId);
    formData.append("carId", carId);

    this.http.post(BaseUrls.getAddUrl(BaseUrls.WISHLIST_GROUPURL), formData)
      .subscribe(() => {
        this.loader = false;
        this.toast.success("Added to Wishlist Successfully");
        this.modalService.dismissAll();
      }, (error) => {
        this.loader = false;
        this.toast.error("Something went wrong!! Please Try Again...")
      })
  }

  openViewCarDetailsModal(modalRef: TemplateRef<unknown>, carModel: any) {
    this.http.get<any>(`${BaseUrls.getUrl(BaseUrls.USER_GROUPURL)}/${carModel.userID}`)
      .subscribe({
        next: ({ data }): void => {
          this.showCarUserInfoBool = new Date(this.userModel.subscriptionExpiry).getTime() >= new Date().getTime();
          this.userInfo = { ...data[0] }
          this.selectedCarModel = { ...carModel };

          this.modalService.open(modalRef);
        },
        error: (err) => {
          console.error(err);
          
          this.toast.error("Unable to fetch information")
        },
      })
  }

}
