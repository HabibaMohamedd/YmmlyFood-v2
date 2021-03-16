import { ApiService } from './../../../services/api.service';
import { GoogletranslateService } from './../../../services/googletranslate.service';
import { GoogleObj } from './../../../models/translated';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  randomRecipes;
  randomRecipesTitles = [];
  checked: boolean;
  isDark = false;
  language = localStorage.getItem('language');
  translatedRecipes;

  constructor(
    private _apiService: ApiService,
    public router: Router,
    private google: GoogletranslateService
  ) {}

  ngOnInit(): void {
    AOS.init();
    console.log(this.language);
    this._apiService.get('recipes/random?number=4').subscribe(
      (response) => {
        let random = Object.values(response);
        this.randomRecipes = random[0];
        console.log(this.randomRecipes);
        if (this.language == 'ar') {
          for (var recipe of this.randomRecipes) {
            this.randomRecipesTitles.push(recipe.title);
          }
          const googleObj: GoogleObj = {
            q: this.randomRecipesTitles,
            target: 'ar',
          };
          this.google.translate(googleObj).subscribe(
            (res: any) => {
              this.translatedRecipes = res.data;
              console.log(res);
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkCheckBoxvalue(event) {
    this.checked = event.target.checked;
    console.log(this.checked);
  }
  onSubmit(searchName: string) {
    if (this.checked == true) {
      this.router.navigate([`kitchen/ingredients/returned-list/${searchName}`]);
    } else {
      this.router.navigate([`kitchen/recipes/returned-list/${searchName}`]);
    }
  }
  test(recipe) {
    console.log(recipe);
  }
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    this.language = localStorage.getItem('language');
    if (theme == 'Dark') {
      this.isDark = true;
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
