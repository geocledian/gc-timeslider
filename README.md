# gc-timeslider widget
## Description
gc-timeslider is an JavaScript/HTML widget for visualizing results of the ag|knowledge REST API from [geocledian](https://www.geocledian.com).
It is built as a reusable [Vue.js](https://www.vuejs.org) component which allows the integration in [Vue.js](https://www.vuejs.org) applications smoothly. 
You may but you don't have to build the rest of the container application with [Vue.js](https://www.vuejs.org).

## Purpose
With this widget you have an UI for navigating the timeseries of the REST API of ag|knowledge from geocledian.com.
> **Please note** that the widget will not load any data itself. It expects to get data from a root vue instance.

## Configuration
This widget is customizeable via HTML attributes and supports the setting of the following attributes.

### Basic options
- gc-language: initial locale language for translation, e.g. "en" for english; default: "en"
- gc-timeseries: array of statistics objects; has to be passed externally, e.g. "$root.timeseries"; default: []
- gc-selected-date: date as simple ISO date string to set the query date of an API product, e.g. '2020-03-01' or "$root.queryDate"; default: ""

### UI options
- gc-available-options: limit the available options, e.g. "" for no options at all; default: "widgetTitle,playButton,backwardForwardButton,dateLabel,numberOfimages";
- gc-widget-collapsed: start the widget with title only; content is hidden; default: "false"

### Advanced options
- gc-image-change-interval: milliseconds for change in video mode; default: 800
  
> __Note__: As there are defaults you will only have to set an attribute to change the default internal value.

## Integration
For the integration of the widget you'll have to follow these steps.

You have to add some dependencies in the head tag of the container website. 
>Please ensure, that you load Vue.js (v.2.6.x) before loading the component first!
Also note that <a href="www.bulma.org">bulma.css</a> and <a href="www.fontawesome.org">Font awesome</a> wll be loaded through gc-timeslider.css.

> __Embedded mode:__ This widget expects a root Vue instance which controls it. It is is designed not be embedded by another Vue application, so there is no init script which loads dependent libraries and the root Vue instance. __You'll have to load at least Vue create the root Vue instance which controls the child by yourself.__ 


```html
<html>
  <head>

    <!--GC component begin -->

    <!-- loads also dependent css files via @import -->
    <link href="css/gc-timeslider.css" rel="stylesheet">
    <!-- init script for components -->
    <script src="js/gc-timeslider.js"></script> 

    <!--GC component end -->
  </head>
```

Then you may create the widget(s) with custom HTML tags anywhere in the body section of the website. Make sure to use an unique identifier for each component.

```html
<div id="gc-app">

    <gc-timeslider 
      gc-widget-id="timeslider1"
      :gc-timeseries="$root.currentTimeseries"
      :gc-selected-date="$root.queryDate">
    </gc-timeslider>
</div>
```

## Support
Please contact [us](mailto:info@geocledian.com) from geocledian.com if you have troubles using the widget!

## Used Libraries
- [Vue.js](https://www.vuejs.org)
- [Vue I18n](https://kazupon.github.io/vue-i18n/)

## Legal: Terms of use from third party data providers
- You have to add the copyright information of the used data. At the time of writing the following text has to be visible for [Landsat](https://www.usgs.gov/information-policies-and-instructions/crediting-usgs) and [Sentinel](https://scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf) data:

```html
 contains Copernicus data 2020.
 U.S. Geological Service Landsat 8 used in compiling this information.
```

**geocledian is not responsible for illegal use of third party services.**