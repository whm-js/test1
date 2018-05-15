import { Base64 } from 'js-base64'
import '../../static/pupload/crypto1/crypto/crypto.js';
import '../../static/pupload/crypto1/hmac/hmac.js';
import '../../static/pupload/crypto1/sha1/sha1.js';

var accessid = 'LTAIGVn1hxMmWS0j';
var accesskey = 'qTGHNA3eyCsyq2zAgAVratjC08DUU4';
var host = 'http://yingedu-ad3.oss-cn-hangzhou.aliyuncs.com';


// now = timestamp = Date.parse(new Date()) / 1000;

var policyText = {
  "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
  "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
  ]
};
policyText = { expiration: '2020-01-01T12:00:00.000Z', conditions: [['content-length-range', 0, 1048576000], ['starts-with', '$key', 'gp_img/shouce/']] }
// console.log(Crypto.Hmac)
var policyBase64 = Base64.encode(JSON.stringify(policyText))
var message = policyBase64
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
// console.log(bytes)
var signature = Crypto.util.bytesToBase64(bytes);
// console.log(signature)
var obj = {
  key: 'gp_img/shouce/',
  policy: policyBase64,
  OSSAccessKeyId: accessid,
  // 让服务端返回200,不然，默认会返回204
  success_action_status: '200',
  signature: signature
}

export const ossobj = obj