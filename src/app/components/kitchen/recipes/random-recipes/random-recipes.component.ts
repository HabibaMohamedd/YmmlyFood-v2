import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { GoogletranslateService } from './../../../../services/googletranslate.service';
import { GoogleObj } from './../../../../models/translated';

@Component({
  selector: 'app-random-recipes',
  templateUrl: './random-recipes.component.html',
  styleUrls: ['./random-recipes.component.scss'],
})
export class RandomRecipesComponent implements OnInit {
  randomRecipes;
  language = localStorage.getItem('language');
  names = [];
  titles = [];
  translatedTitles = [];
  translatedRecipes = [];
  constructor(
    private _apiService: ApiService,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private google: GoogletranslateService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this._apiService.get('recipes/random?number=3').subscribe(
      (response) => {
        this.spinner.hide();
        let random = Object.values(response);
        this.randomRecipes = random[0];
        this.translate(this.randomRecipes);
        console.log(this.randomRecipes);
      },
      (error) => {
        console.log(error);
      }
    );
  }
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
