<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in filesList" :key="index">
      <img :src="getImgUrl(item.url)" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
      </div>
    </div>
    <Upload
      ref="upload"
      :with-credentials="true"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      accept="image/*"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :max-size="maxSize"
      :action="uploadAction"
      :data="extraData"
      type="drag"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="图片预览" v-model="visible">
      <img :src="getImgUrl(imgPath)" style="width: 100%" v-if="imgPath!=null&&imgPath.length>0" />
    </Modal>
  </div>
</template>
<script>
import { getToken } from "../../libs/util";
export default {
  name: "singleImage",
  data() {
    return {
      defaultList: [],
      imgPath: "",
      visible: false,
      extraData: {
        token: getToken()
      },
      filesList: []
    };
  },
  watch: {
    value(newVal) {
      this.filesList = [];
      if(newVal.length <= 0){
        return;
      }
      if (typeof newVal === "string") {
        this.filesList.push({ url: newVal });
      } else {
        for (let index in newVal) {
          this.filesList.push({
            url: newVal[index]
          });
        }
      }
    }
  },
  props: {
    value: {
      type: [Array, String]
    },
    /**
     * @description 图片的最大数量
     */
    maxFileCounts: {
      type: Number,
      default: 1,
      validator: val => {
        return val > 0;
      }
    },
    /**
     * @description 图片的最大尺寸
     */
    maxSize: {
      type: Number,
      default: 20480,
      validator: val => {
        return val > 0;
      }
    },
    /**
     * @description 图片上传地址
     */
    uploadAction: {
      type: String,
      default: ""
    }
  },
  methods: {
    getImgUrl(path) {
      if (path.indexOf("http") >= 0) {
        return path;
      }
      return this.path + path;
    },
    updateData() {
      if (this.maxFileCounts == 1) {
        let result = "";
        for (let index in this.filesList) {
          let item = this.filesList[index];
          if (typeof item.url === "string") {
            result = item.url;
          }
          break;
        }
        this.$emit("input", result);
      } else {
        let result = [];
        for (let index in this.filesList) {
          let item = this.filesList[index];
          if (typeof item.url === "string") {
            result.push(item.url);
          }
        }
        this.$emit("input", result);
      }
    },
    handleView(url) {
      this.imgPath = url;
      this.visible = true;
    },
    handleRemove(index) {
      this.filesList.splice(index, 1);
      this.updateData();
    },
    handleSuccess(res, file) {
      if (res.code == 1) {
        file.url = res.data;
        this.filesList.push({ url: res.data });
        this.updateData();
      } else {
        this.$Message.error(res.msg);
      }
    },
    handleFormatError(file) {
      this.$Message.warning(file.name + "的文件格式不正确，请选择jpg或png。");
    },
    handleMaxSize(file) {
      this.$Message.warning(
        "文件" + file.name + "太大，不超过" + this.maxSize / 1024 + "M。"
      );
    },
    handleBeforeUpload() {
      const check = this.filesList.length < this.maxFileCounts;
      if (!check) {
        this.$Message.warning("最多可以上传" + this.maxFileCounts + "张照片。");
      }
      return check;
    }
  },
  created() {}
};
</script>
<style scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
