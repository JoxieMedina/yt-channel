import { Component, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from 'ionic-angular';
import { YouTubeApi } from "../../shared/youtubeapi.service";
import { VideoPage } from "../pages";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [trigger('expandHeader', [
    state('*', style({ width: '50px', borderRadius: '15px', background: 'transparent' })),
    state('active', style({ width: '100%', height: '100%', borderRadius: '0px', background: 'white', boxShadow: '0 0.5px 20px 0 rgba(230, 33, 23, 0.4)' })),
    transition('* => *', animate('.5s cubic-bezier(0.6, -0.28, 0.74, 0.05)'))
  ])]

})
export class HomePage {
  videos: Array<Object>;
  pageToken: string;
  channelInfo: any;
  section: string = 'two';
  somethings: any = new Array(20);
  bannerUrl: any;
  headerState: string;
  constructor(public navCtrl: NavController, public ytapi: YouTubeApi, public sanitizer: DomSanitizer, public changeDetector: ChangeDetectorRef) {

    this
      .ytapi
      .getChannelInfo()
      .then((_channel: any) => {
        this.channelInfo = _channel.items[0];
        this.bannerUrl = this
          .sanitizer
          .bypassSecurityTrustStyle(`url(${this.channelInfo.brandingSettings.image.bannerImageUrl}) center center`);
      })
      .catch(e => {
        console.info('YT Error: ', e)
      });

    this
      .ytapi
      .getDefaultChannelVideos()
      .then((r: any) => {
        this.videos = r.items;
        this.pageToken = r.nextPageToken;
      })
      .catch(e => {
        console.info('YT Error: ', e)
      })

  }

  handleHeight(e: number) {
    e == 53
      ? this.headerState = 'active'
      : this.headerState = 'inactive';
    this.changeDetector.detectChanges();//Force update the changes
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
      .then((r: any) => {
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
