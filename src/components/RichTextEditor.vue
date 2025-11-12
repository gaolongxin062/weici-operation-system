<!--富文本编辑器-->
<template>
  <div class="editor">
    <div>
      <div :id="rootElement" class="editor-box"></div>
    </div>
  </div>
</template>

<script setup>
import E from 'wangeditor'
import { ref, onMounted, defineProps, watch, defineExpose, defineEmits, nextTick } from 'vue';

let editor = ref(null)
let props = defineProps({
  defaultText: {
    type: String,
    default: ''
  },
  defaultHeight: {
    type: Number,
    default: 200
  },
  rootElement: {
    type: String,
    default: 'div'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

let emit = defineEmits(['editorOnblur'])

onMounted(() => {
  initEditor()
})

function initEditor() {
  editor.value = new E('#' + props.rootElement)
  editor.value.config.zIndex = 5
  editor.value.config.height = props.defaultHeight

  // 不可编辑逻辑
  if (editor.value && props.disabled === true) {
    nextTick(() => {
      editor.value.disable()
    });
  }

  // 失焦回调
  editor.value.config.onblur = function (newHtml) {
    emit('editorOnblur', newHtml)
  }

  // 菜单栏配置（保留 image 菜单）
  editor.value.config.menus = [
    'head', 'bold', 'fontSize', 'fontName', 'italic', 'underline',
    'strikeThrough', 'indent', 'lineHeight', 'foreColor', 'backColor',
    'list', 'justify', 'quote', 'table', 'splitLine', 'undo', 'redo', 'image'
  ]

  // 创建编辑器
  editor.value.create()

  nextTick(() => {
    // 精准定位当前编辑器的图片菜单
    const toolbar = document.querySelector(`#${props.rootElement}`).nextElementSibling; // 编辑器工具栏
    if (!toolbar) return;

    // 找到图片菜单的下拉容器
    const imageMenu = toolbar.querySelector('.w-e-menu-image');
    if (imageMenu) {
      // 触发一次点击
      imageMenu.click();
      nextTick(() => {
        // 隐藏本地上传按钮
        const localUpload = imageMenu.querySelector('.w-e-up-img');
        if (localUpload) localUpload.style.display = 'none';
        const divider = imageMenu.querySelector('.w-e-dropdown-divider');
        if (divider) divider.style.display = 'none';
        // 再次点击关闭下拉菜单
        imageMenu.click();
      });
    }
  })

  // 上传钩子（保留网络图片插入逻辑，本地上传已禁用）
  editor.value.config.uploadImgHooks = {
    customInsert: function (insertImg, result) {
      if (result.data) {
        result.data.forEach(item => {
          insertImg(item.url)
        })
      }
    },
    fail: function (xhr, editor, resData) {
      console.log('fail', resData)
    },
    error: function (xhr, editor, resData) {
      console.log('error', xhr, resData)
    },
  }

  // 初始化默认内容
  if (props.defaultText.length) editor.value.txt.html(props.defaultText)
}

// 获取内容方法
function contentHandle() {
  return editor.value?.txt.html() || ''
}
function textHandle() {
  return editor.value?.txt.text() || ''
}

// 暴露方法
defineExpose({
  contentHandle,
  textHandle
})

// 监听默认内容变化
watch(() => props.defaultText, (newVal) => {
  if (newVal.length && editor.value) {
    editor.value.txt.html(newVal)
  }
})
</script>
<style>
/* 隐藏所有编辑器的本地上传按钮和分隔线 */
.w-e-menu-image .w-e-up-img,
.w-e-menu-image .w-e-dropdown-divider {
  display: none !important;
}

/* 可选：让网络图片按钮居中显示 */
.w-e-menu-image .w-e-dropdown-content {
  padding: 8px 0 !important;
}
</style>

<style scoped>
.editor {
  margin-top: 10px;
}
</style>