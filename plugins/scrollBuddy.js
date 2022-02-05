function initScrollBuddy(){

  let smoothScroll = null
  let lerp = (s,e,a)=>{
    let l = (1 - a) * s + a * e;
    return Math.abs(l - e) < 0.0001 ? e : l;
  }

  window.ScrollBuddy = {
    top:0,
    bottom:0,
    delta:0,
    direction:'down',
    init:(props)=>{
      !smoothScroll
      ? (smoothScroll = new SmoothScroll(props))
      : smoothScroll.reset(props)
    },
    update:()=>{
      smoothScroll && smoothScroll.update()
    },
    reset:()=>{
      smoothScroll && smoothScroll.reset()
    },
    updateScroll:(top,last = ScrollBuddy.top)=>{
      ScrollBuddy.delta = top - last
      ScrollBuddy.top = top
      ScrollBuddy.bottom = top + window.innerHeight
      ScrollBuddy.direction = ScrollBuddy.delta < 0 ? 'up' : ScrollBuddy.delta > 0 ? 'down' : ''
    }
  }

  class SmoothScroll{
    constructor(props){
      this.handleWheel = this.handleWheel.bind(this)
      this.handleScroll = this.handleScroll.bind(this)
      this.updateDocument = this.updateDocument.bind(this)

      if (typeof props.el == 'string'){
        props.el = document.querySelector(props.el)
      }

      this.inertia = props.inertia || .1
      this.el = props.el || document.body
      this.busy = false
      this.document = null;
      this.window = null;
      this.event = props.event || null

      this.setup()
    }

    setup(){
      this.document = document.createElement("div");
      this.window = document.createElement("div");
      this.window.appendChild(this.document);
      document.body.appendChild(this.window);

      this.el.style.willChange = 'transform'
      this.window.style.cssText = `position:fixed;z-index:200;top:0;right:0;bottom:0;width:20px;overflow:scroll;`;
      document.documentElement.style.cssText = `position:fixed;top:0;left:0;right:0;height:100vh;overflow:hidden;`;

      window.addEventListener('wheel',this.handleWheel)
      window.addEventListener('resize',this.updateDocument)
      this.window.addEventListener('scroll',this.handleScroll)

      this.updateDocument()
    }

    reset(){
      this.busy = false
      ScrollBuddy.updateScroll(0,0)
      this.updateDocument()
      this.window.scrollTop = 0
    }

    update(){
      this.updateDocument()
    }

    handleWheel(e){
      e.stopPropagation();
      this.window.scrollTop += e.deltaY * 0.75;
    }

    handleScroll(){
      !this.busy && (this.busy = true) && this.updateScroll()
    }

    updateDocument(){
      this.document.style.height = `${this.el.offsetHeight}px`
    }

    updateScroll(){
      window.requestAnimationFrame(()=>{
        let topTarget = this.window.scrollTop
        let topCurrent = lerp(ScrollBuddy.top,topTarget,this.inertia)
        let val = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${-topCurrent},0,1)`;

        ScrollBuddy.updateScroll(topCurrent)
        this.event && this.event()

        this.el.style.webkitTransform = val;
        this.el.style.msTransform = val;
        this.el.style.transform = val;

        topCurrent == topTarget ? (this.busy = false) : this.updateScroll()
      })
    }
  }


}


initScrollBuddy()
