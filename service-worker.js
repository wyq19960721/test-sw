// console.log(self.location,'location2')
// const cacheList=['./../src/assets/other.jpeg','./../src/assets/timg.jpeg','./../src/assets/one.jpeg',]
const cacheList=['./static/img/other.jpg']
self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open('v1').then((cache)=>{
            return cache.addAll(cacheList)
        }).then(()=>{
          // console.log('installation complete!')
          // return self.skipWaiting()
        })
    )
})
self.addEventListener("activate", event => {
    // console.log(caches.keys());
    event.waitUntil(
      caches
        .keys()
        .then(cachesToDelete => {
            console.log(cachesToDelete)
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        // .then(()=>{
        //   console.log('激活完成！')
        // })
        .then(() => {
          console.log('激活完成')
          console.log("Clients claims.");
          // 立即接管所有页面，酌情处理
          // 会导致新的sw接管旧的页面
          self.clients.claim();
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    // if ('GET' !== event.request.method) return
    // console.log(event.request,'cache res')
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        console.log(response)
        return response;
      } else {
        //在缓存中找不到匹配，发送请求
        return fetch(event.request)
        .then(function (response) {
          let responseClone = response.clone();
          caches.open('v3').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/src/assets/other.jpeg');
        });
      }
    }));
  });
