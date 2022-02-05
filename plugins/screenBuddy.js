const screens = require('../tailwind.config.js').theme.screens;
import {uid,capitalize} from '@/assets/helpers'

function initScreenBuddy(){
  let functions = {}

  Object.keys(screens).forEach(screen => {
    let fns = {}
    let mq = window.matchMedia(`(min-width:${screens[screen]})`)
    let eventFn = (e)=> Object.keys(fns).forEach(key => fns[key](e.matches))

    mq.addEventListener('change',eventFn)

    functions[`on${capitalize(screen)}`]=(fn)=>{
      let id = uid()
      let kill = ()=> delete fns[id]
      fns[id] = fn
      fn(mq.matches)
      return {id,kill}
    }
  })

  window.ScreenBuddy = functions
}

initScreenBuddy()
