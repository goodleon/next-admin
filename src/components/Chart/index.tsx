import { useEffect, useRef, memo, useCallback } from 'react';
import createChart from './tool';
import { isDev } from '@/utils';

interface IChart {
    type: string,
    id: string,
    data: any
}

// 图表缓存 - 使用WeakMap避免内存泄漏
const chartCache = new WeakMap<HTMLElement, any>();

const MyChart = memo((props: IChart) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<any>(null);
    const { type, data, id } = props;
    
    // 使用useCallback优化数据比较
    const dataHash = useCallback(() => {
        if (!data || !Array.isArray(data)) return 'empty';
        return data.length + '_' + data[0]?.name + '_' + data[0]?.value;
    }, [data]);
    
    useEffect(() => {
        if (!chartRef.current) return;
        
        const currentDataHash = dataHash();
        const cacheKey = `${id}-${type}-${currentDataHash}`;
        
        // 如果图表已存在且数据未变化，直接返回
        if (chartInstanceRef.current && chartInstanceRef.current._cacheKey === cacheKey) {
            return;
        }
        
        // 销毁旧图表
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
        
        // 创建新图表
        try {
            chartInstanceRef.current = createChart(chartRef.current, type, data);
            chartInstanceRef.current._cacheKey = cacheKey;
        } catch (error) {
            console.error('图表创建失败:', error);
        }
        
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [type, data, id, dataHash]);
    
    return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
});

MyChart.displayName = 'MyChart';

export default MyChart