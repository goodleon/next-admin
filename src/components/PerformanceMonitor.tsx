'use client';
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentCount: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // 监控内存使用（如果支持）
    const updateMetrics = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // 计算组件数量（简单估算）
      const componentCount = document.querySelectorAll('[data-reactroot]').length || 
                           document.querySelectorAll('*').length;
      
      setMetrics({
        renderTime: Math.round(renderTime * 100) / 100,
        componentCount,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      });
    };

    // 延迟更新，避免阻塞渲染
    const timer = setTimeout(updateMetrics, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>渲染时间: {metrics.renderTime}ms</div>
      <div>组件数量: {metrics.componentCount}</div>
      {metrics.memoryUsage && (
        <div>内存使用: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
