import '@logseq/libs'
import { logMessage } from './util'
import { settingsSchema } from './settings'

/**
 * main entry
 */
async function main() {
  logMessage('插件已初始化');
  
  // 這裡可以添加更多的插件邏輯
}


// bootstrap
logseq.ready(main).catch(console.error)
