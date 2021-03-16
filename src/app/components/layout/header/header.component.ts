import { CommunityService } from './../../../services/community.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
declare const window: any;
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() user: Object;
  isScrolled = false;
  isLogged: boolean;
  userID;
  currentLang = localStorage.getItem('language');

  constructor(
    private _userService: UserService,
    private _communityService: CommunityService,
    public translate: TranslateService
  ) {
    let userId = this._userService.getUserID();
    this.getUser(userId);
    this.translate.use(this.currentLang);
  }

  ngOnInit(): void {}
  navScroll(event) {
    console.log(event);
    this.isScrolled = true;
  }

  logout() {
    this._userService.logout();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('header') as HTMLInputElement;
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 100) {
      header.classList.add('background-header');
    } else if (number < 50) {
      header.classList.remove('background-header');
    }
  }

  menu() {
    const menu = document.querySelector('.menu-trigger') as HTMLInputElement;
    const nav = document.querySelector('.header-area .nav') as HTMLInputElement;

    console.log('clicked');
    menu.classList.toggle('active');
    nav.classList.toggle('drop');
  }
  ngAfterContentChecked() {
    if (localStorage.getItem('Token')) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }
  ngDoCheck() {
    this.currentLang = localStorage.getItem('language');
    const cb = document.querySelector('.checkbox-input') as HTMLInputElement;
    if (localStorage.getItem('Theme') == 'Dark') {
      cb.checked = true;
    } else {
      cb.checked = false;
    }
    if (this.currentLang == 'en') {
      this.currentLang = 'en';
    } else {
      this.currentLang = 'ar';
    }
  }
  isDark = false;
  setTheme(isChecked) {
    if (isChecked) {
      localStorage.setItem('Theme', 'Dark');
      this.isDark = true;
    } else {
      localStorage.setItem('Theme', 'Light');
      this.isDark = false;
    }
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
  testUser;
  getUser(userId) {
    if (userId) {
      this._communityService.getUser(`user/get-user/${userId}`).subscribe(
        (response) => {
          // console.log('This Posts from 86 :', this.postContent);
          this.user = response['Data'];
          this.testUser = response['Data'];

          console.log('user:', this.user);
          // console.log('The fav', this.user.favoritePosts.includes(this.posts[0]));
        },
        (error) => {
          let errorMessage = error['error'].Error;
        }
      );
    }
  }
  isWidthLessThan1200 = false;
  userIconClicked() {
    this.isWidthLessThan1200 = !this.isWidthLessThan1200;
    console.log('1200?', this.isWidthLessThan1200);
  }
}
