import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {YouTubeApi} from "../../shared/youtubeapi.service";
import {VideoPage} from "../pages";
@Component({selector: 'page-home', templateUrl: 'home.html'})
export class HomePage {
  videos : Array < Object >;
  pageToken : string;
  channelInfo : object;
  constructor(public navCtrl : NavController, public ytapi : YouTubeApi) {

    this
      .ytapi
      .getChannelInfo()
      .then((_channel : any) => {
        this.channelInfo = _channel.items[0];
      })
      .catch(e => {
        console.info('YT Error: ', e)
      });

    this
      .ytapi
      .getDefaultChannelVideos()
      .then((r : any) => {
        this.videos = r.items;
        this.pageToken = r.nextPageToken;
      })
      .catch(e => {
        console.info('YT Error: ', e)
      })

  }

  viewVideo(_video) {
    this
      .navCtrl
      .push(VideoPage, _video)
  }

  loadMore() {
    this
      .ytapi
      .getVideosPerPage(this.pageToken)
      .then((r : any) => {
        r
          .items
          .map(o => this.videos.push(o));
        this.pageToken = r.nextPageToken;
      })
      .catch(e => {
        console.info('YT Error: ', e)
      })
  }

}
