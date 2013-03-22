(function () {

  'use strict';
  var context = function($, Intention){

    function throttle(callback, interval){
      var lastExec = new Date(),
        timer = null;

      return function(e){
        var d = new Date();
        if (d-lastExec < interval) {
          if (timer) {
            window.clearTimeout(timer);
          }
          var callbackWrapper = function(event){
            return function(){
              callback(event);
            };
          };
          timer = window.setTimeout(callbackWrapper(e), interval);
          return false;
        }
        callback(e);
        lastExec = d;
      };
    }

    // horizontal resize contexts
    var intent=new Intention,
      resizeContexts = [
        // {name:'luxury', min:900},
        {name:'standard', min:840}, 
        {name:'tablet', min:510},
        {name:'mobile', min:0}];

    // catchall, false as the second arg suppresses the event being fired
    intent.responsive([{name:'base'}]).respond('base')

    // horizontal responsive function
    var hResponder = intent.responsive({
      ID:'width',
      contexts: resizeContexts,
      // compare the return value of the callback to each context
      // return true for a match
      matcher: function(test, context){
        if(typeof test === 'string'){
          
          return test === context.name;
        }
        return test>=context.min
      },
      // callback, return value is passed to matcher()
      // to compare against current context
      measure: function(arg){

        if(typeof arg === 'string'){
          return arg;
        }

        return $(window).width();
    }});

    // create a base context that is always on
    $(window).on('resize', hResponder.respond);
      // .on('orientationchange', hResponder.respond);

    // touch device?
    intent.responsive([{name:'touch'}], function() {
        return "ontouchstart" in window;
      }).respond();

    // retina display?
    intent.responsive(
      // contexts
      [{name:'highres'}],
      // matching:
      function(measure, context){
        return window.devicePixelRatio > 1;
      }).respond();

    // width context
    hResponder.respond();
    intent.elements(document);

    return intent;
  };

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery', 'Intention'], factory);
    } else {
      // Browser globals
      root.intent = factory(root.jQuery, root.Intention);
    }
  }(this, function ($, Intention) {
    return context($, Intention);
  }));
}).call(this);