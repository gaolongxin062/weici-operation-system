import { useVocabularyStore } from '@/store/vocabulary'
import  basicService  from '@/service/BasicService'

export function useOssImage () {
  const userInfoStore = useVocabularyStore()

  /**
   * 获取OSS权限信息
   * @returns {Promise<boolean>} 是否获取成功
   */
  const getOssPower = async () => {
    try {
      const res = await basicService.getOssPower( userInfoStore.user_name, userInfoStore.session )

      if (res.result_code === 200) {
        userInfoStore.powerInfo = res
        return true
      }
      return false
    } catch (error) {
      console.error('获取OSS权限失败:', error)
      return false
    }
  }

  /**
   * 生成OSS图片签名URL
   * @param {string} img - 图片路径
   * @param {string} [bucket='composition-picture'] - 存储桶名称
   * @returns {Promise<string>} 直接返回签名后的URL
   */
  const getOssImageUrl = async (img, bucket = 'composition-pay') => {
    try {
      // 确保权限已获取
      const hasPower = await getOssPower()
      if (!hasPower) return ''

      // 引入OSS客户端
      const OSS = require('ali-oss')
      const client = new OSS({
        authorizationV4: true,
        accessKeyId: userInfoStore.powerInfo.AccessKeyId,
        accessKeySecret: userInfoStore.powerInfo.AccessKeySecret,
        stsToken: userInfoStore.powerInfo.SecurityToken,
        bucket
      })
      // 处理路径并生成签名URL
      // const effectivePath = img.substring(20)
      return client.signatureUrl(img, {})
    } catch (error) {
      console.error('生成OSS图片URL失败:', error)
      return ''
    }
  }

  return {
    getOssImageUrl
  }
}
