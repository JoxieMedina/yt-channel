import {Component} from "@angular/core";
import {NavParams, Events} from "ionic-angular";

declare var YT;

@Component({selector: 'page-video', templateUrl: './video.page.html'})

export class VideoPage {
  video : object;
  private player;
  private ytEvent;
  playerVars : object;
  constructor(public params : NavParams, public events : Events) {
    this.video = params.data;
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

}
