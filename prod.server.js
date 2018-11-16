var express = require('express');
var config = require('./config/index');

var port = process.env.port || config.build.port;

var app = express();

var router = express.Router();

router.get('/', (req, res, next) => {
    req.url = '/index.html';
    next();
});

app.use(router);

var appData = require('./data.json');//加载本地数据文件
var seller = appData.seller;//获取对应的本地数据
var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router()  // 获取一个 express 的路由实例
app.use('/api', apiRoutes)


apiRoutes.get('/goods', (req, res, next) => {
    res.json({
      errno: 0,
      data: goods
    });
});
apiRoutes.get('/ratings', (req, res, next) => {
    res.json({
      errno: 0,
      data: ratings
    });
});

apiRoutes.get('/seller', (req, res, next) => {
    res.json({
      errno: 0,
      data: seller
    });//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
});

app.use(express.static('./dist'));

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + port + '\n')
});