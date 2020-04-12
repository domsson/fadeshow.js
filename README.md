# fadeshow.js

Turn a set of regular elements into a simple fading slideshow. 

No actual visual changes will be performed, `fadeshow.js` just adds/removes 
CSS classes to the relevant elements, enabling you to apply styles that will 
then take care of doing the actual fading. But don't worry, it's quite simple. 
Check the included HTML file for an example.

## Features

- No dependencies, all vanilla JavaScript
- Supports mutliple faders per page
- Your page will still work fine for users without JavaScript
- Very minimal markup requirements (literally just one attribute)
- Does not set, impose or require any CSS rules
- Performs only very little markup changes
- Easy to use, flexible in how to use
- Can be configured to some degree

## How it operates

- Changes slide's classes in a set interval (can be turned off)
- Cycles (goes back to the first slide after the last was shown)
- Can optionally add numbered navigation buttons (one per slide)

## Markup requirements

1. Set the `data-fadeshow` attribute on your container element
2. Either have the slide elements be direct children of the container, or hand 
   in a custom CSS selector for the slides, using the `slide_select` option
  
### Markup example

This is an example for markup that `fadeshow.js` can work with:

	<div data-fadeshow="">
		<img src="foo.jpg">
		<img src="bar.jpg">
		<img src="lol.jpg">
	</div>

Once `fadeshow.js` has processed the above, it would look like this:

	<div class="fadeshow" data-fadeshow="" data-fadeshow-set="">
		<img class="fadeshow-slide active" src="foo.jpg">
		<img class="fadeshow-slide hidden" src="bar.jpg">
		<img class="fadeshow-slide hidden" src="lol.jpg">
	</div>

Optionally, `fadeshow.js` can add a navigation (`ul`) to your container, 
so that users can see how many slides there are and switch to them directly.

## Usage

**Note**: Please remember to minify `fadeshow.js` in production.

Create a `Fadeshow` instance once the DOM has loaded. For example:

	function setupFadeshow() {
		(new Fadeshow()).init();
	}
	window.onload = setupFadeshow;
	
Once `fadeshow.js` has finished initialization, it will have added the 
`data-fadeshow-set` attribute on the slideshow's container element. If you 
pass in a custom attribute, that will be used instead.
 
If you have multiple fadeshows on your page, create one `Fadeshow` instance 
for each of them. This can be done in a loop.
 
## Options

You can pass an object with some configuration options when you create 
a new `Fadeshow` instance. Possible properties are as follows:

| Name            | Default             | Description |
|-----------------|---------------------|-------------|
| `attr`          | `"data-fadeshow"`   | Attribute of the slideshow's container element |
| `name`          | `null`              | Value for the `attr` attribute; useful to differentiate multiple instances |
| `slider_class`  | `"fadeshow"`        | CSS class to set on the container element |
| `slide_sel`     | null                | CSS selector for the slides within the container |
| `slide_class`   | `"fadeshow-slide"`  | CSS class to set on all slides |
| `slide_active`  | `"active"`          | CSS class to set on active slides |
| `slide_hidden`  | `"hidden"`          | CSS class to set on hidden slides |
| `nav_class`     | `"fadeshow-nav"`    | CSS class to set on the slider navigation |
| `button_class`  | `"fadeshow-button"` | CSS class to set on the slider navigation buttons |
| `button_active` | `"active"`          | CSS class to set on active slider navigation buttons |
| `duration`      | `5`                 | Seconds between slide changes; `0` means no automatic slide changes |
| `add_nav`       | `false`             | Add a slider navigation? |

### Example

    var fadeshow = new Fadeshow({ "add_nav": true });
    fadeshow.init();
    
## API

| Function   | Description |
|------------|-------------|
| `init()`   | Initialize the fadeshow, adding classes, elements, event listeners etc |
| `show(i)`  | Show the slide with the given index (0-based) |
| `next()`   | Show the next slide |
| `prev()`   | Show the previous slide |
| `kill()`   | Undo the changes performed by `init()` |

When you call `kill()` on an instance, it will remember the options you 
have set, as well as the container element it was originally attached to. 
This way, you can call `init()` again to re-initialize a fadeshow at any 
point in time. If you ever need to dynamically add or remove a slide from 
a fadeshow, you could call `kill()` and `init()` to make sure the new or 
removed slides are recognized correctly.

