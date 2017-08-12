import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {YouTubeApi} from "../shared/youtubeapi.service";
import {YoutubePlayerModule} from 'ng2-youtube-player';
import {MyApp} from './app.component';
import {HomePage, VideoPage} from '../pages/pages';
import {ShrinkingSegmentHeader} from '../components/shrinking-segment-header/shrinking-segment-header';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MyApp, HomePage, VideoPage, ShrinkingSegmentHeader
  ],
  imports: [
    HttpModule, BrowserModule, YoutubePlayerModule, BrowserAnimationsModule, IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, HomePage, VideoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    YouTubeApi, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
