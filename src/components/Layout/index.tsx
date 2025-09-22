'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, ConfigProvider, Badge, Popover, type MenuProps } from 'antd';
import getNavList from './menu';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
    BellOutlined,
    MoonOutlined,
    SunOutlined,
    TransactionOutlined
} from '@ant-design/icons';
import { getThemeBg } from '@/utils';
import { Link, pathnames, usePathname } from '../../navigation';
import Tabs from '../Tabs';
import { useTabContext } from '../../contexts/TabContext';
import PerformanceMonitor from '../PerformanceMonitor';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
    children: React.ReactNode,
    curActive: string,
    defaultOpen?: string[]
}

const onLogout = () => {
    localStorage.removeItem("isDarkTheme")
}

const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          个人中心
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          切换账户
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" onClick={onLogout} rel="noopener noreferrer" href="/user/login">
          退出登录
        </a>
      ),
    },
  ];

const CommonLayout: React.FC<IProps> = ({ children, curActive, defaultOpen = ['/'] }) => {
  const {
    token: { borderRadiusLG, colorTextBase, colorWarningText },
  } = theme.useToken();

  const t = useTranslations('global');
  const { tabs, activeKey, addTab, removeTab, setActiveKey, closeAllTabs, closeOtherTabs } = useTabContext();

  const locale = useLocale();
  const otherLocale:any = locale === 'en' ? ['zh', '中'] : ['en', 'En'];

  const router = useRouter();
  const pathname = usePathname();
  const navList = getNavList(t);

  const [curTheme, setCurTheme] = useState<boolean>(false);
  const toggleTheme = () => {
        const _curTheme = !curTheme;
        setCurTheme(_curTheme);
        localStorage.setItem('isDarkTheme', _curTheme ? 'true' : '');
  }

  // 菜单项到标签页的映射 - 使用useMemo缓存
  const menuItemMap = useMemo(() => ({
    '/dashboard': { label: '数据大盘', key: 'dashboard' },
    '/dashboard/monitor': { label: '数据监控', key: 'monitor' },
    '/dashboard/chart': { label: '图表制作', key: 'chart' },
    '/dashboard/rpa': { label: '可视化流程编排', key: 'rpa' },
    '/user': { label: '用户管理', key: 'user' },
    '/agents': { label: 'AI智能问答', key: 'agents' },
    '/excel': { label: '电子表格', key: 'excel' },
    '/md': { label: 'MD编辑器', key: 'md' },
    '/formEngine': { label: '表单引擎', key: 'formEngine' },
    '/dragMode': { label: '拖拽搭建', key: 'dragMode' },
    '/board': { label: '办公白板', key: 'board' },
    '/order': { label: '订单列表', key: 'order' },
    '/resource': { label: '资产管理', key: 'resource' },
  }), []);

  const getTabInfo = useCallback((key: string) => {
    return menuItemMap[key as keyof typeof menuItemMap] || { label: '未知页面', key: key.replace('/', '') };
  }, [menuItemMap]);

  const handleSelect = (row: {key: string}) => {
    if(row.key.includes('http')) {
      window.open(row.key)
      return
    }
    
    // 添加标签页
    const tabInfo = getTabInfo(row.key);
    addTab({
      key: tabInfo.key,
      label: tabInfo.label,
      path: row.key,
      closable: true
    });
    
    // 更新URL但不刷新页面
    router.push(row.key);
  }

  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) {
      setActiveKey(key);
      router.push(tab.path);
    }
  }

  useEffect(() => {
      const isDark = !!localStorage.getItem("isDarkTheme");
      setCurTheme(isDark);
  }, []);

  // 根据当前路径自动添加标签页
  useEffect(() => {
    if (pathname && pathname !== '/') {
      const tabInfo = getTabInfo(pathname);
      const existingTab = tabs.find(tab => tab.path === pathname);
      
      if (!existingTab) {
        addTab({
          key: tabInfo.key,
          label: tabInfo.label,
          path: pathname,
          closable: true
        });
      } else if (existingTab.key !== activeKey) {
        setActiveKey(existingTab.key);
      }
    }
  }, [pathname]); // 移除可能导致无限循环的依赖

  return (
    <ConfigProvider
        theme={{
        algorithm: curTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
    >
        <Layout style={{minHeight: "100vh"}}>
            <Sider
                theme={curTheme ? "dark" : "light" }
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                }}
                onCollapse={(collapsed, type) => {
                }}
            >
                <span className={styles.logo} style={getThemeBg(curTheme)}>Next-Admin</span>
                <Menu 
                    theme={curTheme ? "dark" : "light" }
                    mode="inline" 
                    defaultSelectedKeys={[curActive]} 
                    items={navList} 
                    defaultOpenKeys={defaultOpen} 
                    onSelect={handleSelect}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, ...getThemeBg(curTheme), display: 'flex' }}>
                    <div className={styles.rightControl}>
                        <span className={styles.group}>
                            <Popover content={<div style={{width: '100%'}}><img width={180} src="http://cdn.dooring.cn/FlqY2Ji13zIMMzucQITvryG13m5j" /></div>} title="技术交流&分享">
                                { t('technological exchanges') }
                            </Popover>
                        </span>
                        <span className={styles.group}>
                            <Popover content={<div style={{width: '100%'}}><img width={180} src="/pay.png" /></div>} title="开源不易，支持作者">
                            <TransactionOutlined style={{color: 'red'}} /> 赞赏作者
                            </Popover>
                        </span>
                        <span className={styles.msg}>
                            <Badge dot>
                                <BellOutlined />
                            </Badge>
                        </span>
                        <Link href={pathname as any} locale={otherLocale[0]} className={styles.i18n} style={{color: colorTextBase}}>
                            {otherLocale[1]}
                        </Link>
                        <span onClick={toggleTheme} className={styles.theme}>
                            {
                                !curTheme ? <SunOutlined style={{color: colorWarningText}} /> : <MoonOutlined />
                            }
                        </span>
                        <div className={styles.avatar}>
                        <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                            <Avatar style={{color: '#fff', backgroundColor: colorTextBase}}>Admin</Avatar>
                        </Dropdown>
                        </div>
                    </div>
                </Header>
                <Tabs
                  items={tabs}
                  activeKey={activeKey}
                  onChange={handleTabChange}
                  onClose={removeTab}
                  onCloseAll={closeAllTabs}
                  onCloseOthers={closeOtherTabs}
                />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                        style={{
                        padding: 24,
                        minHeight: 520,
                        ...getThemeBg(curTheme),
                        borderRadius: borderRadiusLG,
                        }}
                    >
                        { children }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Next-Admin ©{new Date().getFullYear()} Created by <a href="https://github.com/MrXujiang">徐小夕</a>
                </Footer>
            </Layout>
        </Layout>
        <PerformanceMonitor />
    </ConfigProvider>
  );
};

export default CommonLayout;