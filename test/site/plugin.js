var Connect = require('connect')
var Seneca = require('../..')

var seneca = Seneca()

seneca.use(function (seneca, options, callback) {
  seneca.add({role: 'math', cmd: 'sum'}, function (args, callback) {
    var sum = args.left + args.right
    callback(null, {answer: sum})
  })

  seneca.add({role: 'math', cmd: 'product'}, function (args, callback) {
    var product = args.left * args.right
    callback(null, {answer: product})
  })

  callback(null, {
    service: seneca.http({
      pin: {role: 'math', cmd: '*'},
      map: { sum: {}, product: {} },
      args: { left: parseFloat, right: parseFloat }
    })
  })
})

seneca.use('transport')

Connect()
  .use(Connect.query())
  .use(Connect.json())
  .use(seneca.service())
  .listen(10171)
