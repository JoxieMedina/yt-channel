import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
@Component({templateUrl: 'app.html'})
export class MyApp {
  rootPage : any = HomePage;

  constructor(platform : Platform, statusBar : StatusBar, splashScreen : SplashScreen, events : Events) {
    platform
      .ready()
      .then(() => {
        // Okay, so the platform is ready and our plugins are available. Here you can do
        // any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
        statusBar.backgroundColorByHexString('#991417');
      });
    platform
      .pause
      .subscribe(() => {
        console.log('App Paused');
        events.publish('App:Paused');
      });

    platform
      .resume
      .subscribe(() => {
        console.log('App Resume');
        events.publish('App:Resume');
      });
  }
}
