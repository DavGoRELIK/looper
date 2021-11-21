import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LooperTrack} from "../looper/looper.component";

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  @Input() trackData: LooperTrack;
  @Output() onTrackClick: EventEmitter<LooperTrack> = new EventEmitter<LooperTrack>()
  active = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  // when clicking a track emit an event onTrackClick with the new trackData
  onClickTrack() {
    this.active = !this.active;
    this.onTrackClick.emit({
      audio: this.trackData.audio,
      iconName: this.trackData.iconName,
      filePath: this.trackData.filePath,
      gain: this.trackData.gain,
      source: this.trackData.source,
      isPlaying: this.trackData.isPlaying,
      active: this.active,
    });
  }

}
