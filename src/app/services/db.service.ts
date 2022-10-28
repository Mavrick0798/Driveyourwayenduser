import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, of, take, tap } from 'rxjs';
import { BaseUrls } from '../base-urls';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  public user: Users | null = JSON.parse(localStorage.getItem("user") || "{}");
  public cars: any[] = [];

  // wishlistsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // wishlistsRetreived: boolean = false;

  cartsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  cartsRetreived: boolean = false;

  categoriesSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  categoriesRetreived: boolean = false;
  
  carsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  carsRetreived: boolean = false;

  userCarsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  userCarsRetreived: boolean = false;

  wishlistSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  wishlistRetreived: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getCars();
    this.getWishlist()
    this.getUserCars();
    // this.getUserInterest();
  }

  getWishlist() {
    if(!this.wishlistRetreived) {
      this.http.get(`${BaseUrls.getUrl(BaseUrls.WISHLIST_GROUPURL)}/${this.user?.userId}`)
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.wishlistSub.next(Object.assign([], data))
          this.wishlistRetreived = true
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getCarCategories() {
    if(!this.categoriesRetreived) {
      this.http.get(BaseUrls.getUrl(BaseUrls.CATEGORIES_GROUPURL))
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.categoriesSub.next(Object.assign([], data))
          this.categoriesRetreived = true
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getCars() {
    if(!this.carsRetreived) {
      this.http.get(BaseUrls.getUrl(BaseUrls.CARS_GROUPURL))
      .subscribe({
        next: ({ code, message, data }: any) => {          
          this.cars = data;
          this.carsSub.next(Object.assign([], data))
          this.carsRetreived = true;
          this.getUserInterest();
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getUserCars() {
    if(!this.userCarsRetreived) {
      this.http.get(`${BaseUrls.getUrl(BaseUrls.CARS_GROUPURL)}/${this.user.userId}/user-cars`)
      .subscribe({
        next: ({ code, message, data }: any) => {          
          this.userCarsSub.next(Object.assign([], data))
          this.userCarsRetreived = true;
          this.getUserInterest();
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getUserInterest(): void {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.INTEREST_GROUPURL}/get/${this.user?.userId}`)
      .subscribe({
        next: async ({ data }: any) => {
          let list = Array.from(data).map(e => {
            let car = this.cars.find(x => x.carId === e['carId'])
            return {
              ...e as any,
              ...car
            };
          });
          this.cartsSub.next(list);
        },
        error: (error) => this.toast.warning("Something Went Wrong!! Please Again...", "Failed")
      });
  }

  // async getParticularProductsBasedOnIds(ids: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${BaseUrls.getUrl(BaseUrls.DISHES_GROUPURL)}/dishes?dishIds=${ids}`).pipe(
  //       map(({ code, message, data }: any) => {
  //         resolve(data);
  //       }),
  //       catchError(error => of(error))
  //     ).subscribe();
  //   });
  // }

  // addProductToList(dishId: any): void {
  //   let formData = new FormData();
  //   formData.append("dishId", dishId);
  //   formData.append("userId", this.user?.userId);

  //   this.http.post(BaseUrls.getAddUrl(BaseUrls.CART_GROUPURL), formData)
  //     .subscribe({
  //       next: (value: any) => {
  //         this.getUserCart()
  //         this.toast.success(`Product added to shopping cart`, "Success");
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
  //       }
  //     })
  // }

  // removeItemFromList(id: number,): void {
  //   this.http.get(`${BaseUrls.getDeleteUrl(BaseUrls.CART_GROUPURL)}/${id}`)
  //     .subscribe({
  //       next: (value: any) => {
  //         this.getUserCart()
  //         this.toast.success(`Product removed from shopping cart`, 'Success')
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
  //       }
  //     });
  // }

}
