if('serviceWorker' in navigator){
    window.onload=function(){
      navigator.serviceWorker.register('sw.js',{scope:'/test-sw/'})
      .then((reg)=>{
        var serviceWorker
        console.log(reg,'is main')
        if(reg.installing){
          serviceWorker = reg.installing
          console.log('is installing')
        }else if(reg.active){
          serviceWorker= reg.active
          console.log('is active')
        }
        else if(reg.waiting){
          serviceWorker=reg.waiting
          console.log('is wating')
        }
        if(serviceWorker){
          serviceWorker.addEventListener('statechange',function(e){
          console.log('状态变化为 '+e.target.state)
        })
        }
        
      })
      .catch((err) => {
        console.log(document.location)
        console.log(':'+err)
      })
    }
  }
