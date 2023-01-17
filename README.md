# accountr

A webdav simple ticket-storage system to ease accounting later on. Connets to a webdav server (like the one running inside nextcloud).

Stores credentials and options in localStorage. Has no server-side components (yet).

Is multiuser by nature of how it saves data: in each user's directory.

Built because the Revolut Expenses app which I was using was awful because:
	+ slow to add (must add wrong category info)
	+ impossible to retrieve
	+ 5 euros a month per user ?!?!!! (shady push, seems free at first)

So I built this in about 8 hours.

It saves it into files with a defined naming schema. You can further search and filter with a normal file browser (fuck proprietary databases).

## Developing

```bash
npm run dev
```

## Building

```bash
npm run build
```

You can preview the production build with `npm run preview`.