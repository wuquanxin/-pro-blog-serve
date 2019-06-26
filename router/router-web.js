const Router = require('koa-router');
let route = new Router();
let getDB = require('../tools/baseConnect');
const crypto = require('crypto');


route.prefix('/web');


// 登录
route.post('/login', async(ctx, next) => {
  let createTokenID = (length) => {
    return crypto.randomBytes(length).toString('hex');
  };
  let { username, password } = ctx.request.body;
  console.log(username, password);
  if (username == '' && password == '') {
    ctx.body = {
      code: 500,
      text: '用户名和密码不能为空！'
    }
  } else {
    let coll = getDB().collection('user');
    let result = await coll.findOne({ username, password });
    if (result) {
      if (JSON.stringify(ctx.session) === "{}") {
        let saveToken = createTokenID(16);
        ctx.token = saveToken;
        ctx.session.user = {
          '_id': result._id,
          'userName': username,
          'sex': 1
        }

        ctx.body = {
          code: 200,
          token: saveToken
        }
      } else {
        ctx.body = {
          code: 202,
          text: '已经登录'
        }
      }

    } else {
      ctx.body = {
        code: 500,
        text: '登录失败'
      }
    }
  }


  //
});
route.post('/getUser', async(ctx, next) => {
  let coll = getDB().collection('user');
  let uid = ctx.session.user._id;
  let result = await coll.findOne({_id: uid});
  ctx.body = {
    code: 200,
    information: {name: result.name,headImg: 'https://avatar-static.segmentfault.com/236/913/2369136975-5b620466b27c1_big64'}
  }
});
route.post('/loginOut', async(ctx, next) => {
  ctx.session = {}
  ctx.body = {
    code: 200,
    text: '成功注销！'
  }
});

module.exports = route
