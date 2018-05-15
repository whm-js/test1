<template>
  <div class="eleupload">
    <mt-header fixed :title="'上传图片'" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
    </mt-header>
    <el-upload ref="upload" class="upload-demo" :file-list="fileArr" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" action="http://yingedu-ad3.oss-cn-hangzhou.aliyuncs.com" :on-preview="handlePreview" :onError="uploadError" :onSuccess="uploadSuccess" list-type="picture" :auto-upload="false" :data="uploaddata" multiple>
      <mt-button slot="trigger" size="small" type="primary">选取文件</mt-button>
      <mt-button size="small" type="primary" @click="submitUpload">上传</mt-button>
      <!-- <mt-button size="small" type="primary" @click="showa">显示</mt-button> -->
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->
    <mt-popup v-model="dialogVisible" popup-transition="popup-fade" style="width:80%;overflow:auto;">
      <img width="100%" :src="dialogImageUrl" alt="">
    </mt-popup>
  </div>
</template>

<script>
// import { ossobj } from '../upload/osskey.js'
var that
export default {
  data () {
    return {
      uploaddata: {
        key: '',
        policy: '',
        OSSAccessKeyId: '',
        // 让服务端返回200,不然，默认会返回204
        success_action_status: '200',
        signature: ''
      },
      fileArr: [],
      dir: `gp_img/shouce/${this.getLocalStorageValue('userinfo').userid}/`,
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  created () {
    that = this
  },
  activated () {
    var data = {
      user_id: this.getLocalStorageValue('userinfo').userid,
      source: `record_image_${this.$store.state.handbooktable.TableFlag}`,
      key: '5107'
    }
    this.$httpPost('user-image/list', data, function (err, json) {
      var aaa = json;
      console.log(json.datas)
      // return
      if (aaa.status == 0) {
        that.fileArr = aaa.datas
      } else {
        // that.$Toast("添加失败！");
      }
    });
  },
  methods: {
    goBack () {
      this.$router.push('handbook_input');
    },
    callback () {
      console.log('callback')
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    showa () {
      console.log(this.fileList2)
    },
    beforeRemove(file, fileList) {
      return this.$messagebox
        .confirm("您确定要删除此图片吗?")
        .then(action => {
          // return true;
          var data = {
            id: file.id
          }
          this.$httpPost('user-image/delete', data, function (err, json) {
            var aaa = json;
            // console.log(json.datas)
            that.$Toast("删除成功！");
          });
        })
      },
    submitUpload () {
      // that.$refs.upload.submit();
      // return
      this.$httpPost('upload/oss-auth', { dir: `gp_img/shouce/${this.getLocalStorageValue('userinfo').userid}` }, function (err, json) {
        var aaa = json;
        // console.log(json)
        // return
        if (aaa.status == 0) {
          that.uploaddata.policy = aaa.data.policy
          that.uploaddata.OSSAccessKeyId = aaa.data.accessid
          that.uploaddata.signature = aaa.data.signature
          that.$refs.upload.submit();
        } else {
          // that.$Toast("添加失败！");
        }
      });

    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      // console.log('上传文件', response + file + fileList)
      if (file.name == fileList[fileList.length - 1].name) {
        var fileNameArr = ''
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].hasOwnProperty('user_id')) {
            continue
          }
          if (i == fileList.length - 1) {
            fileNameArr += fileList[i].name
          } else {
            fileNameArr += fileList[i].name + '|'
          }
        }
        let data = {
          user_id: this.getLocalStorageValue('userinfo').userid,
          source: `record_image_${this.$store.state.handbooktable.TableFlag}`,
          key: '5107',
          url: `http://yingedu-ad3.oss-cn-hangzhou.aliyuncs.com/gp_img/shouce/${this.getLocalStorageValue('userinfo').userid}/`,
          names: fileNameArr
        }
        this.$httpPost('user-image/create-batch', data, function (err, json) {
          let aaa = json;
          // console.log(json)
          // return
          if (aaa.status == 0) {
            let data = {
              user_id: that.getLocalStorageValue('userinfo').userid,
              source: `record_image_${that.$store.state.handbooktable.TableFlag}`,
              key: '5107'
            }
            that.$httpPost('user-image/list', data, function (err, json) {
              let aaa = json;
              console.log(json.datas)
              // return
              if (aaa.status == 0) {
                that.fileArr = aaa.datas
              } else {
                // that.$Toast("添加失败！");
              }
            });
          } else {
            // that.$Toast("添加失败！");
          }
        });
      }
      // console.log(fileNameArr)
    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },
    beforeAvatarUpload (file) {
      this.uploaddata.name = file.name
      this.uploaddata.key = this.dir + file.name
      console.log(file)
    }
  }
}
</script>

<style>
.eleupload {
  margin-top: 60px;
  margin-bottom: 20px;
}
.eleupload .el-upload-list__item .el-icon-close {
  display: block;
  bottom: 5px;
  top: auto;
}
</style>

