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
  flag2 = false;
  recipeName: string;
  ingredients = [];
  recipesList: any = [];
  checked: boolean = false;
  isSingle: boolean = false;
  searchParam;
  arrayNutrients = [];
  filterQuery = new Map();
  search = '';
  number = 12;
  numberType = 12;
  numberIng = 12;
  language = localStorage.getItem('language');
  names = [];
  titles = [];
  translatedTitles = [];
  translatedRecipes = [];
  filtersMultipleChoice = [
    {
      filterNameEN: 'cuisine',
      filterNameAR: 'أطباق',
      filterValues: [
        {
          en: 'African',
          ar: 'الأفريقي',
        },
        {
          en: 'American',
          ar: 'أمريكي',
        },
        {
          en: 'British',
          ar: 'بريطاني',
        },
        { en: 'Cajun', ar: 'كاجون' },
        {
          en: 'Caribbean',
          ar: 'منطقة البحر الكاريبي',
        },
        {
          en: 'Chinese',
          ar: 'صينى',
        },
        {
          en: 'Eastern European',
          ar: 'أوربي شرقي',
        },
        {
          en: 'European',
          ar: 'الأوروبي',
        },
        {
          en: 'French',
          ar: 'فرنسي',
        },
        {
          en: 'German',
          ar: 'ألماني',
        },
        {
          en: 'Greek',
          ar: 'يوناني',
        },
        { en: 'Indian', ar: 'هندي' },
        { en: 'Irish', ar: 'إيرلندي' },
        { en: 'Italian', ar: 'إيطالي' },
        { en: 'Japanese', ar: 'اليابانية' },
        { en: 'Korean', ar: 'الكورية' },
        { en: 'Latin American', ar: 'أمريكي لاتيني' },
        { en: 'Mediterranean', ar: 'البحر المتوسط' },
        { en: 'Mexican', ar: 'مكسيكي' },
        { en: 'Middle Eastern', ar: 'شرق اوسطي' },
        { en: 'Nordic', ar: 'شمالي' },
        { en: 'Southern', ar: 'جنوبي' },
        { en: 'Spanish', ar: 'الأسبانية' },
        { en: 'Thai', ar: 'التايلاندية' },
        { en: 'Vietnamese', ar: 'فيتنامي' },
      ],
    },
    {
      filterNameEN: 'intolerances',
      filterNameAR: 'تسبب الحساسية',
      filterValues: [
        { en: 'Dairy', ar: 'ألبان' },
        { en: 'Egg', ar: 'بيضة' },
        { en: 'Gluten', ar: 'الغولتين' },
        { en: 'Grain', ar: 'حبوب' },
        { en: 'Peanut', ar: 'الفول السوداني' },
        { en: 'Seafood', ar: 'مأكولات بحرية' },
        { en: 'Sesame', ar: 'سمسم' },
        { en: 'Shellfish', ar: 'المحار' },
        { en: 'Soy', ar: 'الصويا' },
        { en: 'Sulfite', ar: 'كبريتيت' },
        { en: 'Tree Nut', ar: 'شجرة الجوز' },
        { en: 'Wheat', ar: 'قمح' },
      ],
    },
  ];
  filtersSingleChoice = [
    {
      filterNameEN: 'type',
      filterNameAR: 'نوع الطبق',
      filterValues: [
        { en: 'main course', ar: 'الطبق الرئيسي' },
        { en: 'side dish', ar: 'طبق جانبي' },
        { en: 'dessert', ar: 'الحلوى' },
        { en: 'appetizer', ar: 'مقبلات' },
        { en: 'salad', ar: 'سلطة' },
        { en: 'bread', ar: 'الخبز' },
        { en: 'breakfast', ar: 'وجبة افطار' },
        { en: 'soup', ar: 'حساء' },
        { en: 'beverage', ar: 'مشروب' },
        { en: 'sauce', ar: 'صلصة' },
        { en: 'marinade', ar: 'نقيع' },
        { en: 'fingerfood', ar: 'اصبع الطعام' },
        { en: 'snack', ar: 'وجبة خفيفة' },
        { en: 'drink', ar: 'مشروب' },
      ],
    },
    {
      filterNameEN: 'diet',
      filterNameAR: 'حمية غذائية',
      filterValues: [
        { en: 'gluten free', ar: 'خالي من الغلوتين' },
        { en: 'vegetarian', ar: 'نباتي' },
        { en: 'lacto ovo vegetarian', ar: 'نباتي البويضات اللبنية' },
        { en: 'vegan', ar: 'نباتي' },
        { en: 'pescatarian', ar: 'حمية نباتية' },
        { en: 'paleolithic', ar: 'نظام غذائي من العصر الحجري القديم' },
        { en: 'primal', ar: 'النظام الغذائي البدائي' },
        { en: 'dairy free', ar: 'خالي من منتجات الألبان' },
        { en: 'whole30', ar: 'كله 30' },
      ],
    },
  ];

  filterNutrition = {
    filterNameEN: 'Nutrients',
    filterNameAR: 'العناصر الغذائية',
    filterValues: [
      {
        filterEN: 'Carbs',
        filterAR: 'الكربوهيدرات',
        ranges: ['10-28', '28-46', '46-64', '64-82', '82-100'],
      },
      {
        filterEN: 'Protein',
        filterAR: 'بروتين',
        ranges: ['10-28', '28-46', '46-64', '64-82', '82-100'],
      },
      {
        filterEN: 'Calories',
        filterAR: 'سعرات حراريه',
        ranges: ['50-200', '200-350', '350-500', '500-650', '650-800'],
      },
      {
        filterEN: 'Fat',
        filterAR: 'دسم',
        ranges: ['1-20.8', '20.8-40.6', '40.6-60.4', '60.4-80.2', '80.2-100'],
      },
      {
        filterEN: 'Caffeine',
        filterAR: 'الكافيين',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'SaturatedFat',
        filterAR: 'الدهون المشبعة',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'VitaminA',
        filterAR: 'فيتامين أ',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'VitaminC',
        filterAR: 'فيتامين سي',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'VitaminB2',
        filterAR: 'فيتامين ب 2',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'Iron',
        filterAR: 'حديد',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
      {
        filterEN: 'Sugar',
        filterAR: 'سكر',
        ranges: ['0-20', '20-40', '40-60', '60-80', '80-100'],
      },
    ],
  };

  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxSpinnerService,
    private google: GoogletranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      if (this.isArabic(params['searchName']) == true) {
        this.searchParam = this.translateparam(params['searchName']);
      } else {
        this.searchParam = params['searchName'];
        this.makeParam();
      }
    });
  }
  makeParam() {
    if (this.searchParam == 'query') {
      this.searchParam = 'pasta';
      this.searchParam = 'pasta';
      this.location.replaceState(
        `/kitchen/recipes/returned-list/${this.searchParam}`
      );
    } else if (this.searchParam == 'type') {
      this.searchParam = 'type=breakfast';
      this.searchParam = 'type=breakfast';
      this.location.replaceState(
        `/kitchen/recipes/returned-list/${this.searchParam}`
      );
    }
    this.search = 'Recipe name is ' + this.searchParam + ' ';
    this.recipesList = [];
    this.ingredients = this.searchParam.split(',+');
    if (!this.searchParam.includes('+')) {
      if (this.searchParam.includes('=')) {
        console.log('include =');
        this.getInfoUsingTypes(this.searchParam);
        let array = this.searchParam.split('=');
        this.filterQuery.set(array[0], array[1]);
      } else {
        this.isArabic(this.searchParam);
        this.getInfoUsingName(this.searchParam);
        this.filterQuery.set('query', this.searchParam);
      }
    } else if (this.searchParam.includes('+')) {
      this.getInfoUsingIngredients(this.searchParam);
    }
  }

  clickFilter() {
    this.flag = !this.flag;
  }

  onSubmit(recipeName: string) {
    this.spinner.show();
    this.recipesList = [];
    this.searchParam = recipeName;
    if (this.isArabic(recipeName) == true) {
      this.translateparam(recipeName);
    }
    if (this.checked == false) {
      this.ingredients = [];
      this.location.replaceState(
        `/kitchen/recipes/returned-list/${this.searchParam}`
      );
      this.spinner.hide();
      this.getInfoUsingName(this.searchParam);
      this.ingredients.push(this.searchParam);
    } else if (this.checked == true) {
      if (this.isArabic(this.ingredients[0]) == true) {
        this.translateIng();
      } else {
        const query = this.ingredients.join(',+');
        console.log(query);
        this.location.replaceState(`/kitchen/recipes/returned-list/${query}`);
        this.getInfoUsingIngredients(query);
      }
    }
  }

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
    this.ingredients = [];
    console.log(this.checked);
  }
  delete(index) {
    this.ingredients.splice(index, 1);
  }
  getInfoUsingName(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = 'The recipe name is ' + searchName;
    this.filterQuery;
    this._apiServices
      .get(
        `recipes/complexSearch?query=${searchName}&addRecipeInformation=true&number=${this.number}`
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
          if (this.language == 'ar') {
            this.translate(this.recipesList);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getInfoUsingIngredients(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = 'Ingredients for the recipes is ' + searchName;
    this._apiServices
      .get(
        `recipes/findByIngredients?ingredients=${searchName}&number=${this.numberIng}`
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId;
          this.getMoreInfo(this.recipesList);
          console.log(responseId);
          if (this.language == 'ar') {
            this.translate(this.recipesList);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getInfoUsingTypes(searchName: string) {
    this.spinner.show();
    this.search = '';
    this.search = searchName;
    console.log('Entered here', searchName);
    this._apiServices
      .get(
        `recipes/complexSearch?${searchName}&addRecipeInformation=true&number=${this.numberType}`
      )
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
          if (this.language == 'ar') {
            this.translate(this.recipesList);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getMoreInfo(list: any[]) {
    this.spinner.show();
    this.recipesList = [];
    list.forEach((element) => {
      this._apiServices
        .get(`recipes/${element.id}/information?includeNutrition=false`)
        .subscribe(
          (responseId) => {
            this.spinner.hide();
            this.recipesList.push(responseId);
            console.log(this.recipesList);
            if (this.language == 'ar') {
              this.translate(this.recipesList);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }
  addFilterQuery(
    inputFilter: boolean,
    nameFilter: string,
    valueFilter: string
  ) {
    if (valueFilter.includes('-')) {
      this.arrayNutrients = valueFilter.split('-');
      console.log('min' + nameFilter);
      if (this.filterQuery.has(nameFilter)) {
        this.filterQuery.set('min' + nameFilter, this.arrayNutrients[0]);
        this.filterQuery.set('max' + nameFilter, this.arrayNutrients[1]);
      } else {
        this.filterQuery.set('min' + nameFilter, this.arrayNutrients[0]);
        this.filterQuery.set('max' + nameFilter, this.arrayNutrients[1]);
      }
      console.log(this.filterQuery);
    } else {
      console.log(inputFilter, nameFilter, valueFilter);
      if (inputFilter == true) {
        if (this.filterQuery.has(nameFilter)) {
          if (this.isSingle) {
            this.filterQuery.set(nameFilter, valueFilter);
            this.isSingle = false;
          } else {
            this.filterQuery.set(
              nameFilter,
              this.filterQuery.get(nameFilter) + ',' + valueFilter
            );
          }
        } else {
          this.filterQuery.set(nameFilter, valueFilter);
        }
        console.log(this.filterQuery);
      } else if (inputFilter == false) {
        let value = this.filterQuery.get(nameFilter);
        value = value.replace(',' + valueFilter, '');
        value = value.replace(valueFilter, '');
        this.filterQuery.set(nameFilter, value);
        console.log(this.filterQuery);
        console.log('here' + this.filterQuery.get(nameFilter));
        if (this.filterQuery.get(nameFilter) == '') {
          console.log('Here in delete filter name');
          this.filterQuery.delete(nameFilter);
        }
      }
    }
  }
  filterResults() {
    this.spinner.show();
    let query = '';
    let searchQuery = '';
    //console.log(query);
    this.search = '';
    this.filterQuery.forEach(function (value, key) {
      query = query + key + '=' + value + '&';
      let name = key;
      if (name == 'query') {
        name = 'The recipe name is';
      }
      searchQuery += name + ' is ' + value + ' ';
    });
    this.search = searchQuery;
    console.log(query);
    this._apiServices
      .get(`recipes/complexSearch?addRecipeInformation=true&number=12&${query}`)
      .subscribe(
        (responseId) => {
          this.spinner.hide();
          this.recipesList = responseId['results'];
          console.log(this.recipesList);
          if (this.language == 'ar') {
            this.translate(this.recipesList);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.location.replaceState(`/kitchen/recipes/returned-list/${query}`);
  }
  more() {
    if (this.searchParam.includes('+')) {
      this.numberIng += 12;
      this.getInfoUsingIngredients(this.searchParam);
    } else {
      if (this.searchParam.includes('=')) {
        this.numberType += 12;
        this.getInfoUsingTypes(this.searchParam);
      } else {
        this.number += 12;
        this.getInfoUsingName(this.searchParam);
      }
    }
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
  isArabic(text) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(text);
    return result;
  }
  translateparam(param) {
    const googleObj1: GoogleObj = {
      q: [param],
      target: 'en',
    };
    this.google.translate(googleObj1).subscribe(
      (res: any) => {
        console.log('Param in englis', res);
        this.searchParam = res.data.translations[0].translatedText;
        this.makeParam();
      },
      (err) => {
        console.log(err);
      }
    );
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
        this.getInfoUsingIngredients(query);
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
