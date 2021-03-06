import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogletranslateService } from './../../../../services/googletranslate.service';
import { GoogleObj } from './../../../../models/translated';

@Component({
  selector: 'app-returned-list',
  templateUrl: './returned-list.component.html',
  styleUrls: ['./returned-list.component.scss'],
})
export class ReturnedListComponent implements OnInit {
  flag = false;
  ingredients = null;
  ingredientDetails = [];
  searchParam;
  isReadMoreClicked = null;
  language = localStorage.getItem('language');
  titles = [];
  translatedTitles = [];
  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxSpinnerService,
    private google: GoogletranslateService
  ) {}
  ingredientName: string;

  showMyContainer: boolean = false;

  onSubmit(ingredient) {
    this.ingredientName = ingredient;
    if (this.isArabic(ingredient)) {
      this.translateParam(this.ingredientName);
    } else {
      this.ingredientName = ingredient;
      this.getAllIngredients();
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      console.log(params['searchName']);
      if (this.isArabic(params['searchName'])) {
        this.ingredientName = params['searchName'];
        this.translateParam(params['searchName']);
      } else {
        this.ingredientName = params['searchName'];
        console.log('Reload');
        this.getAllIngredients();
      }
    });
  }

  clickFilter() {
    console.log(this.flag);
    this.flag = !this.flag;
    console.log(this.flag);
    // var app = angular.module('myApp', ['ngAnimate']);
  }

  getAllIngredients() {
    this.ingredientDetails = [];
    this.ingredients = [];
    this.translatedTitles = [];
    this.titles = [];
    console.log(this.ingredientName);
    this.location.replaceState(
      `/kitchen/ingredients/returned-list/${this.ingredientName}`
    );
    this._apiServices
      .get(`food/ingredients/search?query=${this.ingredientName}&`)
      .subscribe(
        (responseId) => {
          this.ingredients = responseId;
          console.log(this.ingredients);
          this.getResults();
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getResults = () => {
    for (let res of this.ingredients.results) {
      this._apiServices
        .get(`food/ingredients/${res.id}/information?amount=1&`)
        .subscribe(
          (responseInfo) => {
            this.spinner.hide();
            console.log(responseInfo);
            this.ingredientDetails.push(responseInfo);
            if (this.language == 'ar') {
              this.translate(this.ingredientDetails);
            }
            console.log(this.ingredientDetails);
            console.log(this.ingredientDetails[0][`nutrition`]);
          },
          (err) => {
            this.spinner.show();
            console.log(err);
          }
        );
    }
  };
  c;
  open_close(currentIndex) {
    if (this.c != currentIndex) {
      this.c = currentIndex;
    } else {
      this.c = null;
    }
  }
  translate(ingredients) {
    for (var ingredient of ingredients) {
      this.titles.push(ingredient.name);
    }
    const googleObj1: GoogleObj = {
      q: this.titles,
      target: 'ar',
    };
    this.google.translate(googleObj1).subscribe(
      (res: any) => {
        console.log(res);
        this.translatedTitles = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  isDark = false;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    this.language = localStorage.getItem('language');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
    if (this.language == 'en') {
      this.language = 'en';
    } else {
      this.language = 'ar';
    }
  }

  isArabic(text) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(text);
    return result;
  }
  translateParam(param) {
    const googleObj1: GoogleObj = {
      q: param,
      target: 'en',
    };
    this.google.translate(googleObj1).subscribe(
      (res: any) => {
        console.log(res);
        this.ingredientName = res.data.translations[0].translatedText;
        this.getAllIngredients();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
