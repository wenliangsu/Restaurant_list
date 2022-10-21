//Section Set the variable
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')


//server related variable
const port = 3000

//Section Set template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Section Static file
app.use(express.static('public'))


//Section Routes setting 
//todo 待修正
app.get('/', (req, res) => {
  res.render('index')
})


//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})