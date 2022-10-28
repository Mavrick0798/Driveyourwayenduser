import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { Car } from 'src/app/models/car';
import { Category } from 'src/app/models/category';
import { Users } from 'src/app/models/users';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-user-cars',
  templateUrl: './user-cars.component.html',
  styleUrls: ['./user-cars.component.css']
})
export class UserCarsComponent implements OnInit {

  userModel: Users = JSON.parse(localStorage.getItem("user") || "{}")
  loader: boolean = false;
  updation: boolean = false;

  cars: Car[] = [];
  carForm: FormGroup;
  selectedCarModel: Car

  categories: Category[] = [];


  constructor(
    private fb: FormBuilder,
    private db: DbService,
    // private aws: AwsService,
    private http: HttpClient,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.db.getUserCars();
    this.db.userCarsSub.subscribe((list) => {
      if (list.length !== 0) {
        this.cars = list;
      }
    })
    this.getCategories();
  }

  getCategories() {
    this.db.getCarCategories();
    this.db.categoriesSub.subscribe((list) => {
      this.categories = list;
    })
  }

  openCarModal(modalRef: any, carModel: any = null) {
    this.modalService.open(modalRef, { size: 'md' });
    this.initializeForm(carModel);
  }

  openDeleteModal(modal: any, carObj: Car){
    this.selectedCarModel = carObj;
    this.modalService.open(modal, {size: 'sm'});
  }

  initializeForm(carModel: Car) {
    if (carModel === null) {
      this.updation = false;
      this.carForm = this.fb.group({
        carId: [-1],
        name: [null],
        description: [null],
        location: [null],
        offers: [null],
        categoryId: [-1],
        userId: [-1],
        price: [0],
        rating: [0],
        addedOn: [new Date()],
        images: this.fb.array([]),
        thumnailImage: [0]
      });
    } else {
      this.updation = true;
      this.carForm = this.fb.group({
        carId: [carModel.carId],
        name: [carModel.name],
        description: [carModel.description],
        location: [carModel.location],
        offers: [carModel.offers],
        categoryId: [carModel.categoryId],
        userId: [carModel.userId],
        price: [carModel.price],
        rating: [carModel.rating],
        thumnailImage: [carModel.thumnailImage],
        images: carModel.images,
        addedOn: [new Date(carModel.addedOn)]
      });
    }
  }

  async saveCar() {
    this.loader = true;
    let values: Car = { ...this.carForm.value };
    values.userId = this.userModel.userId;
    values.categoryId = +values.categoryId;
    console.log(values);


    let formData = new FormData();
    Object.entries(values).forEach(([key, value]: [string, any], idx: number) => formData.append(key, value))

    if (!this.updation) {
      this.http.post<any>(BaseUrls.getAddUrl(BaseUrls.CARS_GROUPURL), formData)
        .subscribe({
          next: ({ data }) => {
            this.loader = false;
            this.cars.push(data[0]);
            this.toast.success("Car Added", "Success");
            this.modalService.dismissAll();
          },
          error: (error) => {
            console.log(error);

            this.loader = false;
            this.toast.warning("Something went wrong!!", "Failed")
          }
        })
    } else {
      this.http.post<any>(BaseUrls.getUpdateUrl(BaseUrls.CARS_GROUPURL), formData)
        .subscribe({
          next: ({ data }) => {
            this.loader = false;
            this.cars[this.cars.findIndex(x => x.carId === data[0].carId)] = { ...data[0] }
            this.toast.success("Car Updated", "Success");
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


  deleteItem(id: any){
    this.loader = true;
    console.log(`${BaseUrls.getDeleteUrl(BaseUrls.CARS_GROUPURL)}/${id}`);
    
    // BaseUrls.getDeleteUthi\
    this.http.get(`${BaseUrls.getDeleteUrl(BaseUrls.CARS_GROUPURL)}/${id}`)
    .toPromise()
    .then(() => {
      let idx = this.cars.findIndex((x) => x.carId == id);
      this.cars.splice(idx,1);
      this.loader = false;
      this.modalService.dismissAll();
    })
    .catch((err) => {
      this.loader = false;
      this.toast.warning("Something went wrong. Please try again later!")
    })
  }



}
