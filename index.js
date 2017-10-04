var SERVER_NAME = 'products-api'
var PORT = 3000;
var HOST = '127.0.0.1';
var counterGet = 0;
var counterPost = 0;

var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server is listening at http://' + HOST + ":" + PORT)
  console.log('Endpoints:')
  console.log('http://' + HOST + ':' + PORT+ '/sendGet' + ' method: GET')
  console.log('http://' + HOST + ':' + PORT + '/sendPost' + ' method: POST')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/sendGet', function (req, res, next) {

  console.log('> sendGet: received request')
  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    console.log('< sendGet: sending response')
    // Return all of the products in the system
    res.send(products)

    counterGet++
    console.log('Processed Request Count--> sendGet: ' + counterGet + ', sendPost: ' + counterPost)
  })
})


// Create a new product
server.post('/sendPost', function (req, res, next) {

console.log('> sendPost: received request')


  // Make sure productname is defined
  if (req.params.productname === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('productname must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  var newproduct = {
		product: req.params.productname,
		price: req.params.price
	}

  // Create the product using the persistence engine
  productsSave.create( newproduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
console.log('< sendPost: sending response')
    // Send the product if no issues
    res.send(201, product)

    counterPost++
    console.log('Processed Request Count--> sendGet: ' + counterGet + ', sendPost: ' + counterPost)
  })


// Delete product with the given id
server.del('/sendDelete', function (req, res, next) {


  // Delete the product with the persistence engine
  //productsSave.delete(req., function (error, product) {
  productsSave = require('save')('')
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})
