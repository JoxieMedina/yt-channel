import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

const URL_BASE = 'https://www.googleapis.com/youtube/v3/';
const YT_API_KEY = 'YOUR-KEY-HERE';
const CHANNEL_ID = 'UClKO7be7O9cUGL94PHnAeOA';//UChYheBnVeCfhCmqZfCUdJQw

@Injectable()

export class YouTubeApi {

  constructor(public http : Http) {}
  /**
 * Look more api options here https://developers.google.com/youtube/v3/docs/
 */

  getChannelInfo() {
    return new Promise((resolve, reject) => {
      this
        .http
        .get(`${URL_BASE}channels?part=snippet,brandingSettings,statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`)
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
        .get(`${URL_BASE}search?order=date&part=id,snippet&channelId=${channelId}&key=${YT_API_KEY}`)
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
        .get(`${URL_BASE}search?order=date&part=id,snippet&channelId=${CHANNEL_ID}&key=${YT_API_KEY}`)
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
        .get(`${URL_BASE}search?order=date&part=id,snippet&channelId=${CHANNEL_ID}&pageToken=${pageToken}&key=${YT_API_KEY}`)
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
        .get(`${URL_BASE}commentThreads?part=snippet&videoId=${videoId}&maxResults=10&order=relevance&key=${YT_API_KEY}`)
        .subscribe((res : Response) => resolve(res.json()), err => reject(err));
    })
  }

}
