import {Component, OnInit} from '@angular/core';
import { interval } from 'rxjs';
import {BaseConfig} from "../../config/buttons.config";

declare const window: any;

export interface LooperTrack {
  active: boolean;
  filePath: string;
  iconName: string;
  audio: HTMLAudioElement;
  isPlaying: boolean;
  gain?: GainNode;
  source?: MediaElementAudioSourceNode;
}

@Component({
  selector: 'app-looper',
  templateUrl: './looper.component.html',
  styleUrls: ['./looper.component.scss']
})
export class LooperComponent implements OnInit {
  myInterval: number;
  merger: ChannelMergerNode;
  tracks: LooperTrack[] = [];
  isEntered = false;

  constructor() {

  }

  ngOnInit(): void {

  }

  // configure and initialize the tracks
  setLoop() {
    // get AudioContext from window (browser)
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    // create tracks array with all the track objects from baseConfig
    this.tracks = BaseConfig.map((buttonConfig) => {
      return {
        active: false,
        audio: new Audio('../../../assets/audio/' + buttonConfig.fileName),
        filePath: buttonConfig.fileName,
        iconName: buttonConfig.icon,
        isPlaying: false
      }
    });

    // instantiate AudioContext
    const ctx = new AudioContext();

    // create channelMerger (for using all the tracks at the same time)
    this.merger = ctx.createChannelMerger(this.tracks.length);
    this.merger.connect(ctx.destination);

    // init all the tracks with gain and source objects
    this.tracks = this.tracks.map((track: LooperTrack) => {
      const gain = ctx.createGain();
      const source = ctx.createMediaElementSource(track.audio);
      source.connect(gain);
      gain.connect(this.merger);
      return {
        active: track.active,
        audio: track.audio,
        filePath: track.filePath,
        iconName: track.iconName,
        isPlaying: track.isPlaying,
        gain: gain,
        source: source
      }
    });

    // init end event for all tracks
    this.tracks.forEach((track: LooperTrack) => {
      track.audio.addEventListener("ended", () => {

        // if isActive (at least one tack is active) then play
        if (this.isActive()) {
          this.play();
        }
      });
    });
  }

  // check if at least one track is active
  isActive(): boolean {
    let ans = false;
    this.tracks.forEach((track: LooperTrack) => {
      if (track.active) {
        ans = true;
      }
    });
    return ans;
  }

  // play all active tracks
  play() {
    this.tracks.forEach((track: LooperTrack) => {
      if (track.active) {
        track.audio.play();
        track.isPlaying = true;
      }
    });

    // init interval for syncing the timing of all the tracks
    if (this.isActive()) {
      if (!this.myInterval) {
        this.myInterval = window.setInterval(() => {
          console.log("interval")
          // if delay of tracks is greater then 50ms then sync time of all currently playing tracks
          if (this.getDelay() >= 0.05) {
            this.setTime(this.getTime());
          }
        }, 200);
      }
    }
  }

  // pause all tracks
  pause() {
    this.tracks.forEach((track: LooperTrack) => {
      track.audio.pause();
      track.isPlaying = false;
    });

    // remove interval because we dont need it when we are not playing any track
    clearInterval(this.myInterval);
  }

  // init loop machine
  start() {
    // configure and initialize all tracks
    this.setLoop();

    // flag to set user enters the loop machine
    this.isEntered = true;
  }

  // return first playing track currentTime
  getTime() {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].isPlaying) {
        return this.tracks[i].audio.currentTime;
      }
    }
    return 0;
  }

  // set time of all playing tracks
  setTime(time: number) {
    this.tracks.forEach((track: LooperTrack) => {
      if (track.isPlaying) {
        track.audio.currentTime = time;
      }
    });
  }

  // check delay between tracks and return the highest delay
  getDelay() {
    const times = [];
    // get current time of all playing tracks
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].isPlaying) {
        times.push(this.tracks[i].audio.currentTime);
      }
    }
    const minTime = Math.min.apply(Math, times);
    const maxTime = Math.max.apply(Math, times);
    return maxTime - minTime;
  }

  // change track active or not active state
  onTrackChange(event: LooperTrack) {
    this.tracks.forEach((track: LooperTrack) => {
      if (track.filePath === event.filePath) {
        track.active = event.active;
        if (!track.active) {
          track.audio.pause();
          track.isPlaying = false;
        }
      }
    });
  }
}

