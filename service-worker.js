const CACHE_NAME = "training-platform-v2";

const APP_FILES = [
"./",
"./index.html",
"./login.html",
"./register.html",
"./trainee.html",
"./trainer.html",
"./admin.html",
"./admin-users.html",
"./admin-courses.html",
"./admin-lessons.html",
"./admin-certificates.html",
"./admin-statistics.html",
"./admin-announcements.html",
"./admin-trainee-requests.html",
"./external-training.html",
"./supabase-config.js",
"./manifest.json",
"./logo.png"
];

self.addEventListener("install", event => {

```
event.waitUntil(

    caches.open(CACHE_NAME)
        .then(cache => cache.addAll(APP_FILES))

);

self.skipWaiting();
```

});

self.addEventListener("activate", event => {

```
event.waitUntil(

    caches.keys().then(keys =>

        Promise.all(

            keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))

        )

    )

);

self.clients.claim();
```

});

self.addEventListener("fetch", event => {

```
if (event.request.method !== "GET") {
    return;
}

event.respondWith(

    caches.match(event.request)
        .then(cachedResponse => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then(networkResponse => {

                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        networkResponse.type === "opaque"
                    ) {
                        return networkResponse;
                    }

                    const responseClone =
                        networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                    return networkResponse;

                })
                .catch(() => {

                    return caches.match(
                        "./index.html"
                    );

                });

        })

);
```

});
