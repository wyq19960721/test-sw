const cacheList=[
    '/',
    '/test-sw.github.io/image/other.jpeg',
    '/test-sw.github.io/image/timg.jpeg',
    '/test-sw.github.io/image/one.jpeg',
    '/test-sw.github.io/index.html',
    '/test-sw.github.io/main.js'
]
self.addEventListener('install',function(e){
    console.log('开始安装11')
    e.waitUntil(
        caches.open('v5').then((cache)=>{
            return cache.addAll(cacheList)
        }).then(()=>{
          console.log('installation complete!')
//           return self.skipWaiting()
        })
    )
})
self.addEventListener("activate", event => {
    console.log('开始激活');
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
        .then(() => {
          console.log('激活完成')
          console.log("Clients claims.");
          // 立即接管所有页面，酌情处理
          // 会导致新的sw接管旧的页面
//           self.clients.claim();
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        console.log('已接管')
      // caches.match() 一直是resolve的，但是成功匹配的结果会有值
      if (response !== undefined) {
        console.log(response)
        return response;
      } else {
        //在缓存中找不到匹配，发送请求
        return fetch(event.request)
        .then(function (response) {
          let responseClone = response.clone();
          caches.open('v5').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/src/assets/other.jpeg');
        });
      }
    }));
  });
