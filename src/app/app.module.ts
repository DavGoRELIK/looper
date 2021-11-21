import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LooperComponent } from '../components/looper/looper.component';
import {ButtonModule} from 'primeng/button';
import { TrackComponent } from '../components/track/track.component';

@NgModule({
  declarations: [
    AppComponent,
    LooperComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
