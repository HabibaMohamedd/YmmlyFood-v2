import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { RouterModule, Routes } from '@angular/router';
import { ReturnedListComponent } from './returned-list/returned-list.component';
import { SharedModule } from '../../layout/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DetailComponent } from './detail/detail.component';
import { TestComponent } from './test/test.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  { path: 'ingredients/search', pathMatch: 'full', component: SearchComponent },
  {
    path: 'ingredients/returned-list/:searchName',
    component: ReturnedListComponent,
  },
  { path: 'ingredients/detail/:id', component: DetailComponent },
  { path: 'ingredients/test', component: TestComponent },
];

@NgModule({
  declarations: [
    SearchComponent,
    ReturnedListComponent,
    DetailComponent,
    TestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
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
export class IngredientsModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/il8n/', '.json');
}
