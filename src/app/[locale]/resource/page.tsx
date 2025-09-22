'use client'
import { Tabs, Skeleton, type TabsProps } from 'antd';
import Layout from '@/components/Layout';
import styles from './index.module.less';
import { useState, useCallback } from 'react';

// 优化后的图片数据，去重并添加懒加载
const imageData = [
  {
    id: 1,
    src: "https://cdn.dooring.cn/FlQJxRYRJx2sMeIuKw76IOJCH-Wp",
    alt: "流程图编辑器 - drawio"
  },
  {
    id: 2,
    src: "https://cdn.dooring.cn/Flpu2lB2-XQghamF6kDBqMsUzM65",
    alt: "可视化白板工具"
  },
  {
    id: 3,
    src: "https://cdn.dooring.cn/FpSCq3pN5AonJpRGbiAPxdYqreeN",
    alt: "可视化白板工具"
  },
  {
    id: 4,
    src: "https://cdn.dooring.cn/FgIzNE5vqLi1Nloxm3Nv7VuqmBJl",
    alt: "可视化白板工具"
  }
];

// 懒加载图片组件
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  const imgRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    }
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ 
            width: '100%', 
            borderRadius: '6px',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {!loaded && inView && (
        <Skeleton.Image 
          style={{ width: '100%', height: '200px' }} 
          active 
        />
      )}
    </div>
  );
};

const List = (
  <div className={styles.fuildWrap}>
    {imageData.map((item) => (
      <LazyImage
        key={item.id}
        src={item.src}
        alt={item.alt}
        className="cardImg"
      />
    ))}
  </div>
)

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '图片',
    children: List,
  },
  {
    key: '2',
    label: '音频',
    children: List,
  },
  {
    key: '3',
    label: '视频',
    children: List,
  },
];


export default function Resource() {
  return (
    <Layout curActive='/resource'>
        <main style={{minHeight: 'calc(100vh - 260px)'}}>
          <Tabs defaultActiveKey="1" items={items} />
        </main>
    </Layout>
    
  );
}
