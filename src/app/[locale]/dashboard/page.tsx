'use client'
import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Chart from '@/components/Chart';
import Sortable from 'sortablejs';
import boardList from './board';
import styles from './index.module.less';

// 懒加载图表组件
const LazyChart = React.memo(({ data, type, id }: { data: any; type: string; id: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {isVisible ? (
        <Suspense fallback={<Spin size="small" />}>
          <Chart data={data} type={type} id={id} />
        </Suspense>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <Spin size="small" />
        </div>
      )}
    </div>
  );
});

LazyChart.displayName = 'LazyChart';

export default function Dashboard() {
  const boardContainerRef = useRef<any>();
  const [sortableInstance, setSortableInstance] = useState<any>(null);

  // 使用useMemo缓存boardList，避免不必要的重新计算
  const memoizedBoardList = useMemo(() => boardList, []);

  useEffect(() => {
    // 延迟初始化拖拽功能，避免阻塞初始渲染
    const timer = setTimeout(() => {
      const element = document.querySelector('#dashboard') as HTMLElement;
      if (element && !sortableInstance) {
        const sortable = new Sortable(element, {
          handle: ".moveBtn",
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag'
        });
        setSortableInstance(sortable);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (sortableInstance) {
        sortableInstance.destroy();
      }
    };
  }, [sortableInstance]);

  return (
    <main className={styles.dashboardWrap}>
        <div className={styles.content} id='dashboard'>
            {memoizedBoardList.map((v, i) => (
                <div key={`${v.id}-${i}`} style={{width: v.w, height: v.h}} className={styles.card}> 
                    <span className='moveBtn'><HolderOutlined /></span>
                    <LazyChart data={v.data} type={v.type} id={v.id} />
                </div>
            ))}
        </div>
    </main>
  );
}
