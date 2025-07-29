<!--富文本编辑器-->
<template>
  <div class="editor">

    <div>

      <div :id="rootElement" class="editor-box"></div>

      <!-- <div type="primary" @click="contentHandle">获取HTML内容</div> -->

      <!-- <div type="primary" @click="textHandle">获取TEXT内容</div> -->

    </div>

  </div>

</template>

<script setup>
  import E from 'wangeditor'
  import { ref, onMounted, defineProps, watch, defineExpose, defineEmits, nextTick } from 'vue';
  import config from '@/config/'
  let editor = ref(null)
  let props = defineProps({
    defaultText: {
      type: String,
      default: ''
    }, // 编辑器中默认内容

    defaultHeight: {
      type: Number,
      default: 200
    }, // 编辑器的默认高度

    rootElement: {
      type: String,
      default: 'div'
    }, // 用于在同一个页面创建多个编辑器

    disabled: {
      type: Boolean,
      default: false
    } // 是否可编辑
  })
  onMounted(() => {
    initEditor() // 初始化富文本编辑器设置
  })
  let emit = defineEmits([
    'editorOnblur'
  ])
  function initEditor () {
      editor.value = new E('#' + props.rootElement)
      editor.value.config.zIndex = 5
      editor.value.config.height = props.defaultHeight // 设置默认高度
      editor.value.config.uploadImgServer = config.BASE_URL + '/account/upload/image'
      editor.value.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为2MB
      editor.value.config.uploadImgMaxLength = 6 // 限制一次最多上传6张图片
      editor.value.config.uploadImgTimeout = 5 * 1000 // 设置超时时间
      editor.value.config.uploadFileName = 'file'

      // const editorContent = document.querySelector('.editor'); 
      if (editor.value && props.disabled === true) {  // 不可编辑
        nextTick(() => {
          editor.value.disable()
        });
        // // editorContent.setAttribute('contenteditable', 'false'); // 禁止内容编辑  
        // editorContent.style.pointerEvents = 'none'; // 禁止鼠标事件  
        // editorContent.style.userSelect = 'none'; // 禁止编辑 
        // editorContent.style.cursor = 'no-drop'; // 鼠标禁止按钮
      }

      //编辑区域 focus（聚焦）和 blur（失焦）时触发的回调函数。
      editor.value.config.onblur = function (newHtml) {
        // alert(newHtml)
        emit('editorOnblur', newHtml)
        editor.value.config.focus = false
      }
      // 配置菜单栏，删减菜单
      editor.value.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'list',
        'justify',
        'quote',
        'table',
        'splitLine',
        'undo',
        'redo',
        'image'
      ]

      editor.value.create()
      
      editor.value.config.uploadImgHooks = {
        customInsert: function (insertImg, result) {
          // console.log(result)
          // result是你的图片上传服务器返回的结果，自定义处理
          // insertImg是一个函数，用于将图片插入到编辑器中
          // 例如：result是{ data: { link: '图片链接' } }
          if (result.data) {
            result.data.forEach(item => {
              insertImg(item.url)
            })
          }
        },
        fail: function(xhr, editor, resData) {
           console.log('fail', resData)
        },
        // 上传图片出错，一般为 http 请求的错误
        error: function(xhr, editor, resData) {
          console.log('error', xhr, resData)
        },
      }

      // 这里为了防止defaultText已经变化了，但是editor还没有初始化导致的不能显示默认内容的问题
      if (props.defaultText.length) editor.value.txt.html(props.defaultText)
    } // 初始化富文本编辑器设置
    function contentHandle () {
      // console.log(editor)
      return (editor.value.txt.html())
      // alert (editor.value.txt.html())
    } // 获取html内容
    defineExpose({
      contentHandle,
      textHandle
    })
    function textHandle () {
      return(editor.value.txt.text())
    } // 获取text内容
    watch(() => props.defaultText, (newVal) => {
      if (newVal.length) editor.value.txt.html(props.defaultText)
    })
</script>
<style>
  /* .editor-box img{
    width:200px !important;
    height:200px !important;
  } */
</style>

<style scoped>

  .editor {
    margin-top: 10px;
  }
</style>