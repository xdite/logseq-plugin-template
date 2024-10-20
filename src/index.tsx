import "@logseq/libs";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // 導入 Tailwind CSS
import { settingsSchema } from './settings';

console.log('index.tsx is being executed');

const LogseqApp: React.FC = () => {
  React.useEffect(() => {
    return () => {
      console.log('logseq-plugin-template 正在卸載');
    };
  }, []);

  return null;
};

const main = async () => {
  console.log('main function called');
  
  // 注册插件设置
  console.log('Registering settings schema...');
  logseq.useSettingsSchema(settingsSchema);
  
  ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
      <LogseqApp />
    </React.StrictMode>
  );

  console.log('logseq-plugin-template 初始化完成');
};

logseq.ready(main).catch(console.error);
