import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Injectable} from "@angular/core";
import {Platform} from 'ionic-angular';
import * as CONSTANTS from "./constants";
import {NativeStorage} from '@ionic-native/native-storage';

@Injectable()

export class YouTubeApi {
  private credentials : any;
  private ytProfile : any;
  constructor(public http : Http, private nativeStorage : NativeStorage, platform : Platform) {
    platform
      .ready()
      .then(() => {
        this
          .nativeStorage
          .getItem('yt_credentials')
          .then(data => {
            this.credentials = data;
          }, error => console.error(error));

        this
          .nativeStorage
          .getItem('yt_profile')
          .then(data => {
            this.ytProfile = data;
          }, error => console.error(error));
      })

  }
  /**
 * Look more api options here https://developers.google.com/youtube/v3/docs/
 */

  getChannelInfo() {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${CONSTANTS.URL_BASE}channels?part=snippet,brandingSettings,statistics&id=${CONSTANTS.CHANNEL_ID}&key=${CONSTANTS.YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   *
   * @param {string} channelId ID of the youtube channel
   */
  getVideosByChannelID(channelId) {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${CONSTANTS.URL_BASE}search?order=date&part=id,snippet&channelId=${channelId}&key=${CONSTANTS.YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   * @return the default channel media
   */
  getDefaultChannelVideos() {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${CONSTANTS.URL_BASE}search?order=date&part=id,snippet&channelId=${CONSTANTS.CHANNEL_ID}&key=${CONSTANTS.YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   *
   * @param pageToken the token of the next page
   */
  getVideosPerPage(pageToken) {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${CONSTANTS.URL_BASE}search?order=date&part=id,snippet&channelId=${CONSTANTS.CHANNEL_ID}&pageToken=${pageToken}&key=${CONSTANTS.YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   *
   * @param videoId the id of the video get the comments
   */
  getVideoComments(videoId) {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${CONSTANTS.URL_BASE}commentThreads?part=snippet&videoId=${videoId}&maxResults=10&order=relevance&key=${CONSTANTS.YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   * @param videoId the id of the video to comment
   * @param content the comment text
  */

  doComment(videoId, accessToken, content) {
    return new Promise((resolve, reject) => {
      this
        .http
        .post(`${CONSTANTS.URL_BASE}commentThreads?part=snippet&key=${CONSTANTS.YT_API_KEY}&access_token=${accessToken}`, {
          "snippet": {
            "channelId": CONSTANTS.CHANNEL_ID,
            "topLevelComment": {
              "snippet": {
                "textOriginal": content
              }
            },
            "videoId": videoId
          }
        })
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   *
   * @param serverAuthCode the server auth code that we gotten in the login
   */
  getAccessToken(serverAuthCode) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = new RequestOptions({headers: headers, withCredentials: true}); // Create a request option
    let serialized = this.serializeObj({code: serverAuthCode, client_secret: CONSTANTS.SECRET_CLIENT, grant_type: 'authorization_code', client_id: CONSTANTS.CLIENT_ID});
    return new Promise((resolve, reject) => {
      this
        .http
        .post(CONSTANTS.URL_TOKEN, serialized, options)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  /**
   *
   * @param refreshToken the refresh_token stored from the last login
   */
  refreshAccessToken(refreshToken) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
    let options = new RequestOptions({headers: headers, withCredentials: true}); // Create a request option
    let serialized = this.serializeObj({refresh_token: refreshToken, client_secret: CONSTANTS.SECRET_CLIENT, grant_type: 'refresh_token', client_id: CONSTANTS.CLIENT_ID});
    return new Promise((resolve, reject) => {
      this
        .http
        .post(CONSTANTS.URL_TOKEN, serialized, options)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }

  /**
 *
 * @param toSave the credentials object to save in the device
 */

  storeProfile(toSave) {
    this
      .nativeStorage
      .setItem('yt_profile', toSave)
      .then(() => console.log('Stored item!'), error => console.error('Error storing item', error));
  }

  getStoredProfile() {
    return this.ytProfile;
  }

  /**
 *
 * @param toSave the credentials object to save in the device
 */

  storeCredentials(toSave) {
    this
      .nativeStorage
      .setItem('yt_credentials', toSave)
      .then(() => console.log('Stored item!'), error => console.error('Error storing item', error));
  }

  getStoredCredentials() {
    return this.credentials;
  }
}
