import { handler } from './build/handler.js'
import polka from 'polka'

const app = polka()

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
  res.end('ok')
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler)

app.listen(4873, () => {
  console.log('listening on port 4873')
})