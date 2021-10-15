/*
 Vue.js Geocledian timeslider component
 created:     2020-06-06, jsommer
 last update: 2020-06-11, jsommer
 version: 0.5
*/
"use strict";

//language strings
const gcTimesliderLocales = {
  "en": {
    "options": { "title": "Timeslider" },
    "labels" : {
      "date" : "Date",
      "no_data": "Sorry, no data available!",
      "images" : "images",
      "of" : "of",
    }

  },
  "de": {
    "options": { "title": "Zeitreihe" },
    "labels" : {
      "date" : "Datum",
      "no_data": "Leider keine Daten verfügbar!",
      "images" : "Aufnahmen",
      "of" : "von",
    }
  },
}

Vue.component('gc-timeslider', {
  props: {
    gcWidgetId: {
      type: String,
      default: 'timeslider1',
      required: true
    },
    gcTimeseries: { 
      type: Array, 
      default: function () { return [] }
    },
    gcSelectedDate: {      
      type: String,
      default: ''
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle,playButton,backwardForwardButton,dateLabel,numberOfimages'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: false // or true
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
    gcImageChangeInterval: {
      type: Number,
      default: 1200 //ms
    }
  },
  template: `<div :id="this.gcWidgetId" class="">

                <p :class="['gc-options-title', 'is-size-6', gcWidgetCollapsed ? 'is-grey' : 'is-orange']" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="toggleTimeslider" 
                  v-show="availableOptions.includes('widgetTitle')">
                 {{ $t('options.title')}}
                  <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- timesilder container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden']" style="width: 100%; margin-bottom: 1em;">

                  <div class="is-flex">
                    <button :class="[isPlaying ? 'is-active' : '', 'button', 'is-light', 'is-orange']" 
                            v-on:click="startPauseVideo()" v-show="this.availableOptions.includes('playButton')">
                      <i class="fas fa-play" v-if="!this.isPlaying"></i>
                      <i class="fas fa-pause" v-else></i>
                    </button>
                    <input type="range" class="slider is-small is-orange" min="0" :max="this.timeseries.length-1" value="0"
                          style="width: 100%" v-model="currentTimeseriesIndex">
                    <button class="button is-light is-orange" v-on:click="backwardTimeSeries()" 
                      v-show="this.availableOptions.includes('backwardForwardButton')">
                      <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="button is-light is-orange" v-on:click="forwardTimeSeries()"
                      v-show="this.availableOptions.includes('backwardForwardButton')">
                      <i class="fas fa-step-forward"></i>
                    </button>
                  </div>
                  <div class="content is-normal is-orange has-text-centered" 
                        v-if="timeseries.length > 0 && getCurrentItem()">
                    <div class="is-small has-text-centered" style="margin-top: 0.25em;"
                      v-show="this.availableOptions.includes('dateLabel')">
                      <i class="fas fa-clock fa-lg"></i>
                      {{ $t('labels.date') }}: {{ getCurrentItem().date }} ({{getCurrentItem().source}})<span v-show="this.availableOptions.includes('numberOfimages')">, #{{ (parseInt(currentTimeseriesIndex)+1)}} {{$t('labels.of') }}  {{this.timeseries.length}} {{$t('labels.images') }}</span>
                    </div>
                  </div>
                  <div class="content is-normal is-orange has-text-centered" 
                    v-show="this.availableOptions.includes('dateLabel')"
                      v-else>
                    <i class="fas fa-clock fa-lg"></i> {{ $t('labels.no_data') }}
                  </div>
                </div> <!-- timeslider container -->

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("timeslider! - data()");
    return {
        currentTimeseriesIndex: -1,
        //video
        isPlaying: false,
        myTimer: {},
        currentTimeSliderPosition: 0,
    }
  },
  i18n: { 
    locale: this.currentLanguage,
    messages: gcTimesliderLocales
  },
  created: function () {
    console.debug("timeslider! - created()");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    console.debug("timeslider! - mounted()");
    
    try {
      this.changeLanguage();
    } catch (ex) {}
  },
  computed: {
    timeseries: {
      get: function () { 
        console.debug("timeseries() getter");
        // console.debug(this.gcTimeseries);
        return this.gcTimeseries;
      },
    },
    availableOptions: {
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
    selectedDate: {
      get: function() {
        return this.gcSelectedDate;
      },
      set: function(value) {
        console.debug("selectedDate - setter: "+value);
        // date to index
        let idx = this.timeseries.indexOf(this.timeseries.filter(t=>t.date == new Date(value).simpleDate() )[0]);
        if (idx >= 0) {
          // changing the index will change the image (if date is available)
          this.currentTimeseriesIndex = idx;
        }
        else {
          this.currentTimeseriesIndex = this.timeseries.length-1; // select latest element
        }
        // emitting to root instance 
        this.$root.$emit("queryDateChange", value);
      }
    },
  },
  watch: {
    gcTimeseries (newValue, oldValue) {
      //select the last one if not set through this.currentTimeSeriesIndex
      //if (this.currentTimeseriesIndex < 0 && this.timeseries.length > 0) {
      if (this.timeseries.length > 0) {
        this.selectedDate = this.timeseries[this.timeseries.length-1].date;
        this.currentTimeseriesIndex = this.timeseries.length-1;
      }
    },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
    },
    gcSelectedDate(newValue, oldValue) {
      console.debug("gcSelectedDateChange");
      //set date
      this.selectedDate = newValue;
    },
    currentTimeseriesIndex (newValue, oldValue) {
      // index to date
      let newDate;
      if (this.currentTimeseriesIndex >= 0 && this.timeseries.length > 0) {
        newDate = this.timeseries[this.currentTimeseriesIndex].date;
        this.$root.$emit("queryDateChange", newDate);
      }
    }
  },
  methods: {  
    toggleTimeslider() {
      this.gcWidgetCollapsed = !this.gcWidgetCollapsed;
    },
    getCurrentItem() {
      if (this.currentTimeseriesIndex >= 0) {
        return this.timeseries[this.currentTimeseriesIndex];
      }
    },
    getCurrentIndex() {
      if (this.timeseries.length > 0) {
        let idx = this.timeseries.indexOf(this.timeseries.filter(t=>t.date == new Date(this.selectedDate).simpleDate() )[0]);
        if (idx >= 0) {
          return idx;
        }
      }
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    startPauseVideo() {
      
      console.log("startPauseVideo()");

      //playing -> pause
      if (this.isPlaying) {
        this.isPlaying = false;
        clearInterval(this.myTimer);
      }
      //paused -> play
      else {
        //reset to start?
        //this.currentTimeSliderPosition = 0;

        this.isPlaying = true;
        let timeSeriesCount = this.timeseries.length;

        clearInterval(this.myTimer);
        //set slider +1 every interval
        this.myTimer = setInterval(function () {

          if (this.currentTimeSliderPosition <= timeSeriesCount) {
            //loop condition; set to min again
            if (this.currentTimeSliderPosition == timeSeriesCount) {
              this.currentTimeSliderPosition = 0;
            }

            this.currentTimeseriesIndex = this.currentTimeSliderPosition + "";
            this.currentTimeSliderPosition++;
          }
        }.bind(this), this.gcImageChangeInterval);
      }
    },
    forwardTimeSeries() {
      var j = parseInt(this.currentTimeseriesIndex);
      j += 1;
      if (j >= 0 && j < this.timeseries.length) {
        this.currentTimeseriesIndex = j + "";
      }
    },
    backwardTimeSeries() {
      var j = parseInt(this.currentTimeseriesIndex);
      j -= 1;
      if (j >= 0 && j < this.timeseries.length) {
        this.currentTimeseriesIndex = j + "";
      }
    },
    /* helper functions */
    formatDecimal(decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */

      var factor = 100;

      if (isNaN(parseFloat(decimal))) {
        return NaN;
      }
      if (numberOfDecimals == 1) {
        factor = 10;
      }
      if (numberOfDecimals == 2) {
        factor = 100;
      }
      if (numberOfDecimals == 3) {
        factor = 1000;
      }
      if (numberOfDecimals == 4) {
        factor = 10000;
      }
      if (numberOfDecimals == 5) {
        factor = 100000;
      }
      return Math.ceil(decimal * factor) / factor;
    },
  }
});
