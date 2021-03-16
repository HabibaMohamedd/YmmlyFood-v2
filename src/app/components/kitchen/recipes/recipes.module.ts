import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReturnedListComponent } from './returned-list/returned-list.component';
import { RandomRecipesComponent } from './random-recipes/random-recipes.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { SharedModule } from '../../layout/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  { path: 'recipes/search', component: SearchComponent },
  {
    path: 'recipes/returned-list/:searchName',
    component: ReturnedListComponent,
  },
  {
    path: 'recipes/recipe-details/:id/information',
    component: RecipeDetailsComponent,
  },
  {
    path: 'recipes/explore-all-random-recipes',
    component: RandomRecipesComponent,
  },
  { path: 'recipes/plan-meal', component: MealPlanComponent },
  { path: 'recipes/favorite-recipes', component: FavoriteRecipesComponent },
];

@NgModule({
  declarations: [
    SearchComponent,
    RecipeDetailsComponent,
    ReturnedListComponent,
    RandomRecipesComponent,
    MealPlanComponent,
    FavoriteRecipesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    NgApexchartsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [SharedModule],
})
export class RecipesModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/il8n/', '.json');
}
