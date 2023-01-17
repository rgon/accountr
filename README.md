# accountr

A simple ticket-storage system to ease accounting later on. Connects to a webdav server (like the one running inside nextcloud).

Installable as a PWA.

Built because the Revolut Expenses app which I was using was awful because:
	+ slow to add (must add wrong category info)
	+ impossible to retrieve
	+ 5 euros a month per user ?!?!!! (shady push, seems free at first)

Is multiuser by nature of how it saves data: in each user's directory. Teams may set up the app to work in a subdirectory of a larger folder, shared with the financial team.

So I built this in about 8 hours.

It saves it into files with a defined naming schema. You can further search and filter with a normal file browser (fuck proprietary databases). Then you can easily pass the files along to your auditor.

Stores credentials and options in localStorage. Has no server-side components (yet).

## Developing

```bash
npm run dev
```

## Building

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment
You may run the docker-compose project in the root dir and expose it.

Don't forget to allow CORS access to your domain frmm the source url. On NGINX:

`nginx.conf`:
```nginx
    map $http_origin $allow_origin {
        ~^https?://(.*\.)?YOURDOMAINDOTCOM(:\d+)?$ $http_origin;
        ~^https?://(.*\.)?localhost(:\d+)?$ $http_origin;
        default "";
    }
```

`nextcloudDomain.com`
```
    location / {
		...
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Headers' 'authorization,content-type' always;
            add_header 'Access-Control-Allow-Origin' $allow_origin always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';

            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
		proxy_pass LOCALSERVER;
    }
```