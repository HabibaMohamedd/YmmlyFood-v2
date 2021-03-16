import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GoogletranslateService } from './../../../../services/googletranslate.service';
import { GoogleObj } from './../../../../models/translated';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  flag = false;
  flag2 = false;
  recipeName: string;
  ingredients = [];
  checked: boolean = false;
  searchParam;

  constructor(private router: Router, private google: GoogletranslateService) {}

  ngOnInit(): void {}

  save(event) {
    if (this.checked) {
      console.log('You entered: ', event.target.value);
      this.ingredients.push(event.target.value);
      console.log(this.ingredients);
      event.target.value = '';
      event.preventDefault();
    } else {
      console.log('Not checked');
    }
  }

  checkCheckBoxvalue(event) {
    this.checked = event.target.checked;
    console.log(this.checked);
  }
  delete(index) {
    this.ingredients.splice(index, 1);
  }
  onSubmit(recipeName: string) {
    console.log(recipeName);
    if (this.checked == false) {
      this.ingredients = [];
      this.router.navigate([`kitchen/recipes/returned-list/${recipeName}`]);
    } else if (this.checked == true) {
      if (this.isArabic(this.ingredients[0]) == true) {
        this.translateIng();
      } else {
        const query = this.ingredients.join(',+');
        console.log(query);
        this.router.navigate([`kitchen/recipes/returned-list/${query}`]);
      }
    }
  }
  isArabic(text) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(text);
    return result;
  }
  translateIng() {
    const googleObj1: GoogleObj = {
      q: [this.ingredients],
      target: 'en',
    };
    this.google.translate(googleObj1).subscribe(
      (res: any) => {
        let array = [];
        for (let item of res.data.translations) {
          console.log(item);
          array.push(item.translatedText);
        }
        const query = array.join(',+');
        console.log(query);
        this.router.navigate([`kitchen/recipes/returned-list/${query}`]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
