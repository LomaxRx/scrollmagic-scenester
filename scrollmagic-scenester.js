/*
 * ScrollMagic.Scenester v0 (2016-02-13)
 * Scrollmagic plugin for grouping Scenes by class and chaining scene creation
 *
 * @version 0
 * @license Dual licensed under MIT license and GPL.
 * @author Andrew Lomax <andrewlomaxr@gmail.comc>
 *
 */

/**
* @namespace ScrollMagic.Scenester
*/

(function (root, factory) {

    if ( typeof define === 'function' && define.amd ) {
        define(['jquery', 'ScrollMagic', 'GSAP'], factory);
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('jquery'), require('scrollmagic'), require('gsap') );
    } else {
        root.returnExports = factory(root.jQuery, root.ScrollMagic, root.TweenMax);
    }

}( this, function ( $, ScrollMagic, gsap ){

'use strict';
/**
  * Scenester defines a group of scenes by a common trigger element
  *
  * @class Scenester
  *
  * @param {string} triggerElement - parent selector that will trigger all scenes
  * @param {Object} controller - the ScrollMagic controller for this scene
  */
ScrollMagic.Scenester = function( el, controller ){
  this.sceneGroups = {};
  this.el = el;
  this.controller = controller;

  this.timeline = new TimelineMax();
  this.timeline.pause();

  return this;
}

var s = ScrollMagic.Scenester.prototype;

/**
  * @function ScenessetScene
  *
  * @param {string} name - name of scene. useful for retrieving array of scenes with `Scenester.getScenes( name );`
  * @param {string} selector - usually a child element of TriggerElement, DOM element that all scene options will be applied to
  * @param {Object} options
  * @param {string} [options.scene] - options that you'd otherwise pass to `ScrollMagic.Scene`
  * @param {string} [options.triggerRelationship=parent] - specify relationship of scene to trigger element.
  ** `"self"` - ignores trigger element and triggers scene at element's position
  ** `"aunt"`/ `"uncle"` - sibling of trigger element
  ** `"sibling"` - sibling of scene element
  ** `"parent"` - not necessarily direct parent, but any ancestor of scene element. To limit selection to direct parent, specify scene selector as `.parent > .child`.
  * @param {Object} [options.tween] - define GSAP tween parameters
  * @param {Object} [options.tween.to]
  * @param {Object} [options.tween.from]
  * @param {string|number} [options.tween.duration]
  * @param {string|number} [options.tween.stagger]
  * @param {string|number} [options.tween.position]
  * @param {Object} [options.timeline] - queue up timeline events. uses same parameters as `options.tween`
  * @param {Object} [options.on] - bind callback to on events. Can specify multiple events
  * @example
  * scenester.setScene( 'example-scene', '.selector', {
  *   scene: { triggeHook: 0.5, duration: '100%', offset: '30vh' },
  *   triggerRelationship: 'self', // overrides trigger element and triggers scene at scene element
  *   addIndicators: true,
  *   tween: {
  *     duration: 2,
  *     from: { opacity: 0 },
  *     to: { opacity: 1 }
  *   },
  *   on: {
  *     'enter,leave': function(event){
  *        // ..
  *      },
  *      'add': function(event){}
  *   }
  * });
  * @param {string} [options.pin] - selector for pinning element.
  * @param {boolean} [options.addIndicators=false] - requires debug.addIndicators plugin
  * @returns {Object} Scenester
  */
s.setScene = function( name, selector, opts ){
  var sceneOpts = opts ? opts.scene : {};
  if( !sceneOpts ) sceneOpts = {};

  var triggerRelationship = opts.triggerRelationship ? opts.triggerRelationship : 'parent';

  var sceneGroup =
      this.sceneGroups[name] =
      new SceneGroup( selector, this.el, sceneOpts, triggerRelationship );

  if( opts.tween )
    sceneGroup.setTween( opts.tween );

  if( opts.timeline )
    sceneGroup.addToTimeline( this.timeline, opts.timeline );

  if( opts.pin )
    sceneGroup.setPin( opts.pin );

  if( opts.on ){
    for( var k in opts.on )
      sceneGroup.on( k, opts.on[k] );
  }

  if( opts.addIndicators )
    sceneGroup.addIndicators();

  sceneGroup.addTo( this.controller );

  return this;
}

/**
  * Removes all scenes from Scenester
  * @function removeAll
  */
s.removeAll = function(){
  for( var k in this.sceneGroups )
    this.sceneGroups[k].remove();

  this.sceneGroups = {};
  return this;
}

/**
  * Removes all scenes from Scenester
  * @function getScenes
  *
  * @param {string} name - name of scenes to retrieve
  * @returns {Object[]} array of `ScrollMagic.Scene`
  */
s.getScenes = function( name ){
  return this.sceneGroups[name].scenes;
}

/**
  * Remove scene
  * @function removeScene
  *
  * @param {string} name - name of scene to remove
  */
s.removeScene = function( name ){
  this.sceneGroups[name].remove();
  delete this.sceneGroups[name];
  return this;
}

/**
  * Start timeline
  * @function play
  */
s.play = function(){
  this.timeline.play();
  return this;
}

/**
  * Pause timeline
  * @function pause
  */
s.pause = function(){
  this.timeline.pause();
  return this;
}

/**
* @class SceneGroup
* @private
*/
function SceneGroup( selector, triggerEl, opts, triggerRelationship ){

  if( triggerRelationship == 'self' )
    this.$trigger = $( triggerEl ).find( $(selector) );
  else
    this.$trigger = $( triggerEl );

  this.selector = selector;
  this.opts     = opts;
  this.scenes   = [];
  this.triggerRelationship = triggerRelationship;
  /**
    * @constructor
    */
  function init(){
    var self = this;
    this.$trigger.each( function(){
        var sceneOpts = $.extend( {}, self.opts );
        sceneOpts.triggerElement = this;
        if( typeof sceneOpts.duration === 'function' )
          sceneOpts.duration = sceneOpts.duration.apply( this );

        if( typeof sceneOpts.offset === 'string' ){
          if( sceneOpts.offset.indexOf( '%' ) !== -1 ){
            sceneOpts.offset = $( this ).outerHeight() * ( sceneOpts.offset.replace( '%', '' ) / 100 );

          } else if( sceneOpts.offset.indexOf( 'vh' ) !== -1 ){
            sceneOpts.offset = $( window ).height() * ( sceneOpts.offset.replace( 'vh', '' ) / 100 );
          }
        }

        var scene = new ScrollMagic.Scene( sceneOpts );

        self.scenes.push( scene );
      });

      return self;
  }

  this.setTween = function( args ){
    this.eachScene( function( scene, el, i ){
      var tween = tweenFactory( el, args );
      scene.setTween( tween );
    });
  }

  this.addToTimeline = function( timeline, args ){
    this.eachScene( function( scene, el, i ){
      var tween = tweenFactory( el, args, timeline );
    });
  }

  function tweenFactory( el, args, timeline ){
    var vars1 = args.from,
        vars2 = args.to,
        vars3 = args.position,
        vars4,
        method;

    if( vars1 && vars2 ){ method = 'fromTo'; }
    else if( vars1 ){
      method = 'from';
      vars2 = args.position
    } else {
      method = 'to';
      vars1 = args.to;
      vars2 = args.position;
    }

    if( args.stagger ){
      if( method == 'fromTo' ){
        vars3 = args.stagger;
        vars4 = args.position;
      } else {
        vars2 = args.stagger;
        vars3 = args.position;
      }

      method = 'stagger' + method.charAt(0).toUpperCase() + method.slice(1);
    }

    if( args.duration === undefined ) args.duration = 0;

    if( timeline )
      return timeline[method]( el, args.duration, vars1, vars2, vars3, vars4 );
    return TweenMax[method]( el, args.duration, vars1, vars2, vars3, vars4 );
  }

  this.setPin = function( pinnedElement ){
    this.eachScene( pinnedElement, function( scene, el, i ){
      scene.setPin( el[0], opts )
    });
  }

  this.on = function( events, callback ){
    this.eachScene( function( scene, el, i ){
      scene.on( events, callback );
    });
  }

  this.remove = function(){
    this.eachScene( function( scene ){
      scene.remove();
    });
  }

  this.addTo = function( controller ){
    this.eachScene( function( scene ){
      scene.addTo( controller );
    });
  }

  this.addIndicators = function(){
    this.eachScene( function( scene ){
      scene.addIndicators();
    });
  }

  this.findSceneElement = function( scene, selector ){
    var trigger = $( scene.triggerElement() );
    var $els;
    if( this.triggerRelationship == 'aunt' || this.triggerRelationship == 'uncle' )
      $els = trigger.siblings().find( $(selector) );
    else if( this.triggerRelationship == 'sibling' )
      $els = trigger.siblings( $(selector) );
    else if( this.triggerRelationship == 'self' )
      $els = trigger;
    else
      $els = trigger.find( $(selector) );

    return $els;
  }
  /*
  * Apply a function to each scene or scene element in SceneGroup
  * Alternatively -- find elements in scene and apply function
  */
  this.eachScene = function(){
    var fn, selector;

    if( arguments.length == 2 ){
      selector = arguments[0];
      fn = arguments[1];
    } else {
      selector = this.selector;
      fn = arguments[0];
    }

    for( var i = 0; i < this.scenes.length; i++ ){
      var scene  = this.scenes[i];
      var $els = this.findSceneElement( scene, selector );
      fn( scene, $els , i );
    }
  }

  return init.call( this );
}

}));
