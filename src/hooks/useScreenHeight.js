import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue'

export function useScreenHeight() {
  const screenHeight = ref(null);
  const isMobileDevice = ref(false); // 默认是桌面电脑
  const isMobile = () => { // 判断是移动端 还是桌面端
    const userAgent = navigator.userAgent.toLowerCase()
    return /android|iphone|ipad|ipod|mobile/i.test(userAgent)
  }
  const calculateHeight = () => {
    nextTick(() => { // 确保 DOM 更新完成
      isMobileDevice.value = isMobile()
      if (isMobileDevice.value) {
        screenHeight.value = null
        return
      }
      const element = document.getElementById('forms');
      const titleElement = document.getElementById('page-title');
  
      if (element && titleElement) {
        const formHeight = element.getBoundingClientRect().height;
        const titleHeight = titleElement.getBoundingClientRect().height;
        const pageHeight = 80; // 分页高度
        const menuHeight = 64; // 导航栏高度
        screenHeight.value = window.innerHeight - formHeight - titleHeight - pageHeight - menuHeight  - 80; // 80其余padding等大概值
      }
    });
  };
 
  // 组件挂载后计算高度，并监听 resize 事件
  onMounted(() => {
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
  });
 
  // 组件卸载前移除监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateHeight);
  });
 
  return { screenHeight, isMobileDevice };
}


