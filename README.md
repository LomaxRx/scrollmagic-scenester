# ScrollMagic Scenester

[ScrollMagic](https://github.com/janpaepke/ScrollMagic) plugin for grouping scenes and applying one scene to multiple elements.


## Example
rework of [parallax example](http://janpaepke.github.io/ScrollMagic/examples/advanced/parallax_sections.html).

```javascript
var controller = new ScrollMagic.Controller();

var scenes = new ScrollMagic.Scenester( '.parallax', controller )

  .setScene( 'parallax-scene', '.parallax > div', {
    addIndicators: true,
    scene: { triggerHook: 'onEnter', duration: '200%' },
    tween: {
      to: { y: '80%', ease: Linear.easeNone }
    }
  });
```
## Classes

<dl>
<dt><a href="#Scenester">Scenester</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#setScene">setScene(name, selector, options)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#removeAll">removeAll()</a></dt>
<dd><p>Removes all scenes from Scenester</p>
</dd>
<dt><a href="#getScenes">getScenes(name)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Removes all scenes from Scenester</p>
</dd>
<dt><a href="#removeScene">removeScene(name)</a></dt>
<dd><p>Remove scene</p>
</dd>
<dt><a href="#play">play()</a></dt>
<dd><p>Start timeline</p>
</dd>
<dt><a href="#pause">pause()</a></dt>
<dd><p>Pause timeline</p>
</dd>
</dl>

<a name="Scenester"></a>

## Scenester
**Kind**: class  
<a name="new_Scenester_new"></a>

### new ScrollMagic.Scenester(triggerElement, controller)
Scenester defines a group of scenes by a common trigger element and allows for
chaining scene creation.


| Param | Type | Description |
| --- | --- | --- |
| triggerElement | <code>string</code> | parent selector that will trigger all scenes |
| controller | <code>Object</code> | the ScrollMagic controller for this scene |

<a name="setScene"></a>

## setScene(name, selector, options) ⇒ <code>Object</code>
**Kind**: function  
**Returns**: <code>Object</code> - Scenester  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | name of scene. useful for retrieving array of scenes with `Scenester.getScenes( name );` |
| selector | <code>string</code> |  | usually a child element of TriggerElement, DOM element that all scene options will be applied to |
| options | <code>Object</code> |  |  |
| [options.scene] | <code>string</code> |  | options that you'd otherwise pass to `ScrollMagic.Scene` |
| [options.triggerRelationship] | <code>string</code> | <code>&quot;parent&quot;</code> | specify relationship of scene to trigger element. • `"self"` - ignores trigger element and triggers scene at element's position • `"aunt"`/ `"uncle"` - sibling of trigger element • `"sibling"` - sibling of scene element • `"parent"` - not necessarily direct parent, but any ancestor of scene element. To limit selection to direct parent, specify scene selector as `.parent > .child`. |
| [options.tween] | <code>Object</code> |  | define GSAP tween parameters |
| [options.tween.to] | <code>Object</code> |  |  |
| [options.tween.from] | <code>Object</code> |  |  |
| [options.tween.duration] | <code>string</code> &#124; <code>number</code> |  |  |
| [options.tween.stagger] | <code>string</code> &#124; <code>number</code> |  |  |
| [options.tween.position] | <code>string</code> &#124; <code>number</code> |  |  |
| [options.timeline] | <code>Object</code> |  | queue up timeline events. uses same parameters as `options.tween` |
| [options.on] | <code>Object</code> |  | bind callback to events. Can specify multiple events |
| [options.pin] | <code>string</code> |  | selector for pinning element. |
| [options.addIndicators] | <code>boolean</code> | <code>false</code> | requires debug.addIndicators plugin |

**Example**  
```js
scenester.setScene( 'example-scene', '.selector', {
  scene: { triggeHook: 0.5, duration: '100%', offset: '30vh' },
  // overrides trigger element and triggers scene at scene element
  triggerRelationship: 'self',
  addIndicators: true,
  tween: {
    duration: 2,
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  on: {
    'enter,leave': function(event){
       // ..
     },
     'add': function(event){}
  }
});
```
<a name="removeAll"></a>

## removeAll()
Removes all scenes from Scenester

**Kind**: function  
<a name="getScenes"></a>

## getScenes(name) ⇒ <code>Array.&lt;Object&gt;</code>
Removes all scenes from Scenester

**Kind**: function  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of `ScrollMagic.Scene`  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of scenes to retrieve |

<a name="removeScene"></a>

## removeScene(name)
Remove scene

**Kind**: function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of scene to remove |

<a name="play"></a>

## play()
Start timeline

**Kind**: function  
<a name="pause"></a>

## pause()
Pause timeline

**Kind**: function  
