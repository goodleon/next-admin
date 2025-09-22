'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TabItem } from '@/components/Tabs';

interface TabContextType {
  tabs: TabItem[];
  activeKey: string;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveKey: (key: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (key: string) => void;
  getTabByPath: (path: string) => TabItem | undefined;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      key: 'dashboard',
      label: '数据大盘',
      path: '/dashboard',
      closable: false, // 首页不可关闭
    }
  ]);
  const [activeKey, setActiveKey] = useState('dashboard');

  const addTab = useCallback((newTab: TabItem) => {
    setTabs(prevTabs => {
      // 检查是否已存在相同路径的标签
      const existingTab = prevTabs.find(tab => tab.path === newTab.path);
      if (existingTab) {
        // 如果标签已存在且不是当前活动标签，才更新活动标签
        if (existingTab.key !== activeKey) {
          setActiveKey(existingTab.key);
        }
        return prevTabs;
      }
      
      // 添加新标签
      const updatedTabs = [...prevTabs, newTab];
      setActiveKey(newTab.key);
      return updatedTabs;
    });
  }, [activeKey]);

  const removeTab = useCallback((key: string) => {
    setTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(tab => tab.key === key);
      if (tabIndex === -1) return prevTabs;
      
      const newTabs = prevTabs.filter(tab => tab.key !== key);
      
      // 如果关闭的是当前活动标签，需要切换到其他标签
      if (key === activeKey && newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        setActiveKey(newTabs[newActiveIndex].key);
      }
      
      return newTabs;
    });
  }, [activeKey]);

  const closeAllTabs = useCallback(() => {
    setTabs(prevTabs => {
      // 保留不可关闭的标签（如首页）
      const keepTabs = prevTabs.filter(tab => !tab.closable);
      if (keepTabs.length > 0) {
        setActiveKey(keepTabs[0].key);
      }
      return keepTabs;
    });
  }, []);

  const closeOtherTabs = useCallback((key: string) => {
    setTabs(prevTabs => {
      const keepTabs = prevTabs.filter(tab => tab.key === key || !tab.closable);
      setActiveKey(key);
      return keepTabs;
    });
  }, []);

  const getTabByPath = useCallback((path: string) => {
    return tabs.find(tab => tab.path === path);
  }, [tabs]);

  const value: TabContextType = {
    tabs,
    activeKey,
    addTab,
    removeTab,
    setActiveKey,
    closeAllTabs,
    closeOtherTabs,
    getTabByPath,
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};
