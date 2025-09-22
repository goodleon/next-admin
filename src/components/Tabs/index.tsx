'use client';
import React from 'react';
import { Tabs as AntTabs, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import styles from './index.module.less';

export interface TabItem {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
}

interface Props {
  items: TabItem[];
  activeKey: string;
  onChange: (activeKey: string) => void;
  onClose: (key: string) => void;
  onCloseAll?: () => void;
  onCloseOthers?: (key: string) => void;
}

const Tabs: React.FC<Props> = ({
  items,
  activeKey,
  onChange,
  onClose,
  onCloseAll,
  onCloseOthers
}) => {
  const handleTabEdit = (targetKey: string | React.MouseEvent | React.KeyboardEvent, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      onClose(targetKey);
    }
  };

  const tabItems: TabsProps['items'] = items.map(item => ({
    key: item.key,
    label: item.label,
    closable: item.closable !== false,
  }));

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        <AntTabs
          type="editable-card"
          activeKey={activeKey}
          onChange={onChange}
          onEdit={handleTabEdit}
          items={tabItems}
          hideAdd
          className={styles.tabs}
        />
        <div className={styles.tabActions}>
          {onCloseOthers && (
            <Button 
              size="small" 
              onClick={() => onCloseOthers(activeKey)}
              className={styles.actionBtn}
            >
              关闭其他
            </Button>
          )}
          {onCloseAll && (
            <Button 
              size="small" 
              onClick={onCloseAll}
              className={styles.actionBtn}
            >
              关闭全部
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
