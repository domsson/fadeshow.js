class Fadeshow
{
	constructor(o)
	{
		// options (defaults)
		this.attr          = "data-fadeshow";
		this.name          = null;
		this.slider_class  = "fadeshow";
		this.slide_sel     = null;
		this.slide_class   = "fadeshow-slide";
		this.slide_active  = "active";
		this.slide_hidden  = "hidden";
		this.nav_class     = "fadeshow-nav";
		this.button_class  = "fadeshow-button";
		this.button_active = "active";
		this.duration      = 5;
		this.add_nav       = false;

		// copy over user provided options
		Object.assign(this, o);

		// state
		this.slider  = null;
		this.nav     = null;
		this.slides  = [];
		this.buttons = [];
		this.current = -1;
		this.sliding = false;
		this.timer   = null;
		this.paused  = false;
		this.hover_handler = null;
	}

	/*
	 * Add the given CSS class to the given element. If the given class is falsy 
	 * (for example `null` or an empty string), this function does nothing.
	 */
	add_class(e, c)
	{
		e && c && e.classList.add(c);
	}
	
	/*
	 * Remove the given CSS class to the given element. If the given class is falsy
	 * (for example `null` or an empty string), this function does nothing.
	 */
	rem_class(e, c)
	{
		e && c && e.classList.remove(c);
	}
	
	
	init()
	{
		if (!(this.slider = this.find_slider())) return false;
	
		for (let slide of this.find_slides())
		{
			this.add_class(slide, this.slide_class);
			this.slides.push(slide);
		}
	
		if (!this.slides.length) return false;
	
		if (this.add_nav) this.make_nav();
	
		this.hide_all();
		this.show(this.current = 0);
	
		this.hover_handler = this.on_hover.bind(this);
		this.slider.addEventListener("mouseover", this.hover_handler);
		this.slider.addEventListener("mouseout",  this.hover_handler);
	
		if (this.duration)
		{
			this.timer = window.setInterval(this.on_timer.bind(this), this.duration * 1000);
		}
	
		this.add_class(this.slider, this.slider_class);
		this.slider.setAttribute(this.attr + "-set", "");
		return true;
	}
	
	/*
	 * Find the slider element according to `this.attr` and `this.name`.
	 * If `this.slide` is already set, no search performed and that element
	 * is returned instead. If no slider can be found, null is returned.
	 */
	find_slider()
	{
		if (this.slider) return this.slider; // slider already set

		let q = `[${this.attr}="${this.name ? this.name : ''}"]`;
		let sliders = document.querySelectorAll(q);
		for (let slider of sliders)
		{
			if (!slider.hasAttribute(this.attr + "-set")) return slider;
		}
		return null;
	}
	
	/*
	 * Find all elements within `this.slider` that match `this.slide_sel`
	 * or, if that isn't set, return all child elements of `this.slider`.
	 */
	find_slides()
	{
		return this.slide_sel ?
			this.slider.querySelectorAll(this.slide_sel) : 
			this.slider.children;
	}
	
	make_nav()
	{
		let nav = document.createElement("ul");
		nav.classList.add(this.nav_class);
		let handler = this.on_button.bind(this);	
	
		for (let i = 0; i < this.slides.length; ++i)
		{
			let btn = document.createElement("li");
			btn.setAttribute("data-slide-idx", i);
			this.add_class(btn, this.button_class);
			btn.addEventListener("click", handler);
			let txt = document.createElement("span");
			txt.innerHTML = (i + 1);
			btn.appendChild(txt);
			nav.appendChild(btn);
			this.buttons.push(btn);
		}
		this.slider.appendChild(nav);
		this.nav = nav;
	}

	/*
	 * Event handler for when a slide nav button has been pressed.
	 * Looks up the corresponding slide and shows it.
	 */
	on_button(evt)
	{
		let i = parseInt(evt.currentTarget.getAttribute("data-slide-idx"));
		(i == this.current) || this.show(i);
	}

	/*
	 * Event handler for when the a mouse hover event occurs.
	 * If the mouse is hovering over the slider, we pause the slideshow.
	 */
	on_hover(evt)
	{
		if (evt.currentTarget != this.slider) return;
		this.paused = (event.type == "mouseover");
	}
	
	/*
	 * Event handler for a timer event, which we use to automatically 
	 * progress to the next slide after a certain amount of time.
	 */ 
	on_timer(evt)
	{
		return this.paused || this.next();
	}
	
	/*
	 * Shows the previous slide.
	 */
	prev()
	{
		let prev = this.current == 0 ? this.slides.length - 1 : this.current - 1;
		return this.show(prev);
	}
	
	/*
	 * Shows the next slide.
	 */
	next()
	{
		let next = (this.current == this.slides.length - 1) ? 0 : this.current + 1;
		return this.show(next);
	}
	
	/*
	 * Shows the slide at position `idx`.
	 */
	show(idx)
	{
		if (this.sliding) return false;
		if (idx < 0 || idx >= this.slides.length) return false;
	
		this.sliding = true;
		this.hide(this.current);
	
		this.rem_class(this.slides[idx], this.slide_hidden);
		this.add_class(this.slides[idx], this.slide_active);
		this.add_class(this.buttons[idx], this.button_active);
		
		this.current = idx;
		this.sliding = false;
		return true;
	}
	
	hide(idx)
	{
		this.rem_class(this.slides[idx], this.slide_active);
		this.add_class(this.slides[idx], this.slide_hidden);
		this.rem_class(this.buttons[idx], this.button_active);
	}
	
	hide_all()
	{
		for (let i = 0; i < this.slides.length; ++i) this.hide(i);
	}
	
	kill()
	{
		// remove classes/attributes
		// note: no need to remove nav/button classes,
		//       as the entire nav will be removed from DOM
		this.rem_class(this.slider, this.slider_class);
		this.slider.removeAttribute(this.attr + "-set");
		for (let slide of slides)
		{
			this.rem_class(this.slide, this.slide_class);
			this.rem_class(this.slide, this.slide_active);
			this.rem_class(this.slide, this.slide_hidden);
		}
	
		// remove event listeners
		// note: no need to remove button listeners,
		//       as the entire nav will be removed from DOM
		this.slider.removeEventListener("mouseover", this.hover_handler);
		this.slider.removeEventListener("mouseout", this.hover_handler);
	
		// remove/halt timer/interval
		clearInterval(this.timer);
	
		// remove slider nav from DOM
		this.slider.removeChild(this.nav);
	
		// reset state vars
		// note: we do not reset this.slider, so we can re-initialize
		//       this fadeshow instance at any time, if so requested
		this.slides  = [];
		this.nav     = null;
		this.buttons = [];
		this.current = -1;
		this.sliding = false;
		this.timer   = null;
		this.paused  = false;
		this.hover_handler = null;
	}
}
