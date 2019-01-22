var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var Client = require('node-rest-client').Client
var client = new Client()

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost:3030,www.haiyaozhu.com')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length,Authorization,Accept,X-Request-With'
  )
  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST,GET')
  if (req.method == 'OPTIONS') res.send(200)
  else next()
})

//在线用户
var onlineusers = {}
//chat 队列
var chatlist = {}

io.on('connection', function(socket) {
  //监听用户上线
  socket.on('login', function(obj) {
    console.log(obj)
    var chatKey = obj.from + '_' + obj.to
    var target = chatlist[obj.to + '_' + obj.from]
    socket.from = obj.from
    socket.to = obj.to
    socket.fromName = obj.fromName
    socket.toName = obj.toName
    socket.token = obj.token
    socket.openId = obj.openId
    //	console.log(obj.chatType);
    socket.type = obj.chatType
    try {
      if (!target) {
        // 对方不在线 提示自己 对方不在线
        socket.emit('targetoffline')
      } else {
        // 对方在线 提示对方 对方已在线
        target.emit('targetonline')
      }
    } catch (err) {
      console.log(err)
    }
    //加入列表
    onlineusers[obj.from] = obj.from
    chatlist[chatKey] = socket
    console.log(obj.fromName + '登陆系统' + ',和' + obj.toName + '聊天')
  })
  //监听用户下线
  socket.on('disconnect', function() {
    console.log(socket.fromName + '退出系统')
    var target = chatlist[socket.to + '_' + socket.from]
    onlineusers[socket.from] = null // 删除在线用户列表相应用户
    chatlist[socket.from + '_' + socket.to] = null // 删除聊天列表相应聊天
    try {
      target.emit('targetoffline') // 提示对方 用户已下线
    } catch (err) {
      console.log(err)
    }
  })
  //监听用户发布内容
  socket.on('message', function(obj) {
    var target = chatlist[obj.to + '_' + obj.from]
    var status = 0
    try {
      // console.log(obj.to + '_' + obj.from);
      if (onlineusers[socket.from] && target) {
        console.log(obj)
        status = 1
        target.emit('message', obj)
      } else {
        console.log('用户不在线')
        status = 0
        socket.emit('targetoffline')
      }
    } catch (err) {
      console.log(err)
    }
    var args = {
      data: {
        head: {
          token: socket.token,
          openid: socket.openId
        },
        from: socket.from,
        to: socket.to,
        from_name: socket.fromName,
        to_name: socket.toName,
        message: obj.content,
        type: 1,
        status: status,
        direction: socket.type,
        chatType: 1
      },
      headers: { 'Content-Type': 'application/json' }
    }
    client.post('http://m.haiyaozhu.com/openapi/msg_save', args, function(
      data,
      response
    ) {
      console.log('===========')
      console.log(data)
      console.log('===========')
    })
  })
  socket.on('error', function(error) {
    console.log(error)
  })
})

http.listen(3333, function(socket) {
  console.log('listening on *:3333')
})
