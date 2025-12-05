import { provideHttpClient} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryComponent } from "./pages/country/country.component";
import {MedalChartComponent} from "./components/medal-chart/medal-chart.component";
import {CountryCardComponent} from "./components/country-card/country-card.component";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    CountryComponent,
    MedalChartComponent,
    CountryCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule]
  ,
  providers: [
    provideHttpClient(),
    {provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
