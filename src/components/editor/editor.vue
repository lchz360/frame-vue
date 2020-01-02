<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import { oneOf } from "@/libs/tools";
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: ""
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: "html",
      validator: val => {
        return oneOf(val, ["html", "text"]);
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 图片上传路径
     */
    uploadImgServer: {
      type: String,
      default: ""
    },
  },
  watch: {
    value(newVal) {
      this.editor.txt.html(newVal);
    }
  },
  computed: {
    editorId() {
      return `editor${this._uid}`;
    }
  },
  methods: {
    setHtml(val) {
      this.editor.txt.html(val);
    }
  },
  mounted() {
    this.editor = new Editor(`#${this.editorId}`);
    this.editor.customConfig.onchange = html => {
      let text = this.editor.txt.text();
      if (this.cache) localStorage.editorCache = html;
      this.$emit("input", this.valueType === "html" ? html : text);
      this.$emit("on-change", html, text);
    };
    this.editor.customConfig.onchangeTimeout = this.changeInterval;
    this.editor.customConfig.uploadImgServer = this.uploadImgServer;
    this.editor.customConfig.withCredentials = true;
    this.editor.customConfig.uploadImgMaxLength = 5;
    this.editor.customConfig.uploadImgParams = {
      token: this.$store.state.user.token
    };
    this.editor.customConfig.customAlert = info => {
      this.$Message.error(info);
    };
    this.editor.customConfig.uploadImgHooks = {
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: (insertImg, result) => {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        if (result.code == 1) {
          result.data.forEach(item => {
            insertImg(this.path + item);
          });
        } else {
          this.$Message.error(result.msg);
        }

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    };
    // create这个方法一定要在所有配置项之后调用
    this.editor.create();
    // 如果本地有存储加载本地存储内容
    let html = this.value;
    if (html) this.editor.txt.html(html);
  }
};
</script>

<style lang="less">
.editor-wrapper * {
  z-index: 100 !important;
}
.w-e-text-container,
.w-e-text-container * {
  z-index: 99 !important;
}
</style>
