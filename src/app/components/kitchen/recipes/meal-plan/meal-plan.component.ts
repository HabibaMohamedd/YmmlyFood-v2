import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { GoogletranslateService } from './../../../../services/googletranslate.service';
import { GoogleObj } from './../../../../models/translated';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss'],
})
export class MealPlanComponent implements OnInit {
  constructor(
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private google: GoogletranslateService
  ) {}
  planRecipes;
  planRecipesDetails = [];
  language = localStorage.getItem('language');
  names = [];
  titles = [];
  translatedTitles = [];
  translatedRecipes = [];
  ngOnInit(): void {
    this.spinner.show();
    this._apiService
      .get('/mealplanner/generate?timeFrame=day&addRecipeInformation=true&')
      .subscribe(
        (response) => {
          let random = Object.values(response);
          // this.planRecipes = random[0];
          this.planRecipes = response;
          console.log(this.planRecipes);
          this.getResults();
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getResults = () => {
    for (let res of this.planRecipes.meals) {
      this._apiService.get(`recipes/${res.id}/information?amount=1&`).subscribe(
        (responseInfo) => {
          console.log(responseInfo);
          this.planRecipesDetails.push(responseInfo);
          console.log(this.planRecipesDetails);
          if (this.planRecipesDetails.length >= 3) {
            this.translate(this.planRecipesDetails);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  refresh() {
    this.ngOnInit();
  }
  back() {
    this._location.back();
  }
  translate(recipesList) {
    for (var recipe of recipesList) {
      this.titles.push(recipe.dishTypes[0] || ' ');
      this.names.push(recipe.title || ' ');
    }
    console.log(this.titles, this.names);
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
    const googleObj2: GoogleObj = {
      q: this.names,
      target: 'ar',
    };
    this.google.translate(googleObj2).subscribe(
      (res: any) => {
        console.log(res);
        this.translatedRecipes = res.data;
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
}
