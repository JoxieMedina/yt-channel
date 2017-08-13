import {Component} from "@angular/core";
import {NavParams, Events, AlertController} from "ionic-angular";
import {YouTubeApi} from '../../shared/youtubeapi.service'
import {GooglePlus} from '@ionic-native/google-plus';
import * as CONSTANTS from '../../shared/constants';
declare var YT;

@Component({selector: 'page-video', templateUrl: './video.page.html'})

export class VideoPage {
  video : any;
  private player;
  private ytEvent;
  playerVars : object;
  access_token : string;
  constructor(public params : NavParams, public events : Events, public alert : AlertController, public ytApi : YouTubeApi, public googleplus : GooglePlus) {
    this.video = params.data;
    this.access_token = '';
    console.log(this.video)

    this
      .ytApi
      .getVideoComments(this.video.id.videoId)
      .then(comments => {
        console.dir(comments)
      })
    /**
     * view all the params
     * https://developers.google.com/youtube/player_parameters
     */
    this.playerVars = {
      'loop': 1,
      'controls': 2,
      'showinfo': 0,
      'rel': 0,
      'modestbranding': 1
    };

    //To avoid the play store rejection
    this
      .events
      .subscribe('App:Paused', () => {
        this.pauseVideo();
      });
  }

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    if (player) {
      this.player = player;
      this.playVideo();
    }

  }

  playVideo() {
    this
      .player
      .playVideo();
  }
  pauseVideo() {
    this
      .player
      .pauseVideo();
  }

  doLogin() {
    this
      .googleplus
      .login({scopes: CONSTANTS.SCOPES, webClientId: CONSTANTS.CLIENT_ID, offline: true})
      .then(res => {
        console.log('Login: ', res);
        this
          .ytApi
          .storeProfile(res);
        if (res.serverAuthCode) {
          this
            .ytApi
            .getAccessToken(res.serverAuthCode)
            .then((r : any) => {
              console.log('token', r);
              this
                .ytApi
                .storeCredentials(r);
              this.access_token = r.access_token;
            })
            .catch(e => console.log(e))
        }
      })
      .catch(error => console.log(error))
  }

  doComment() {
    let credentials : any = this
      .ytApi
      .getStoredCredentials();
      console.log(credentials);
    if (credentials && credentials.access_token) {
      this
        .ytApi
        .doComment(this.video.id.videoId, credentials.access_token, 'Awesome video, thanks !')
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
          if (error.status == 401 && credentials.refresh_token) {
            this
              .ytApi
              .refreshAccessToken(credentials.refresh_token)
              .then((newCredentials : any) => {
                credentials.access_token = newCredentials.access_token;
                this
                  .ytApi
                  .storeCredentials(credentials);
                this.doComment();
              })
              .catch(e => console.log('Refresh Error:', e))
          }
        });
    } else {
      this
        .alert
        .create({title: 'Atention', message: 'Do Login to comment'})
        .present();
    }

  }

}
