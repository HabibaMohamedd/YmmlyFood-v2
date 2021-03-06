import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  // home here
  { path: '', component: HomeComponent },
  // { path: "**", redirectTo: '/kitchen' },
  {
    path: 'ingredients',
    loadChildren: () =>
      import('./ingredients/ingredients.module').then(
        (m) => m.IngredientsModule
      ),
  },

  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '/kitchen' },

  // login
  // register
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RecipesModule,
    IngredientsModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [],
})
export class KitchenModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/il8n/', '.json');
}
