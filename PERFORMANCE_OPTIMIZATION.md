# 性能优化指南

## 🚀 已实施的优化措施

### 1. 图表组件优化
- ✅ 移除了 `JSON.stringify` 的性能瓶颈
- ✅ 实现了智能缓存机制，避免重复创建图表
- ✅ 使用 `React.memo` 防止不必要的重新渲染
- ✅ 优化了数据比较逻辑

### 2. Dashboard页面优化
- ✅ 实现了图表懒加载（Intersection Observer）
- ✅ 延迟初始化拖拽功能，避免阻塞初始渲染
- ✅ 使用 `useMemo` 缓存数据
- ✅ 添加了 Suspense 边界

### 3. Layout组件优化
- ✅ 修复了无限循环问题
- ✅ 使用 `useMemo` 和 `useCallback` 优化函数
- ✅ 减少了不必要的重新渲染

### 4. 性能监控
- ✅ 添加了开发环境性能监控组件
- ✅ 实时显示渲染时间、组件数量、内存使用

## 🔍 进一步优化建议

### 1. 代码分割
```javascript
// 使用动态导入
const ChartEditor = dynamic(() => import('./ChartEditor'), {
  loading: () => <Spin />,
  ssr: false
});
```

### 2. 虚拟化长列表
```javascript
// 对于大量数据的表格
import { FixedSizeList as List } from 'react-window';
```

### 3. 图片优化
```javascript
// 使用 Next.js Image 组件
import Image from 'next/image';
```

### 4. 数据库查询优化
- 实现分页加载
- 添加数据缓存
- 优化API响应时间

## 📊 性能监控指标

### 开发环境监控
- 渲染时间：< 100ms 为良好
- 组件数量：< 1000 个为正常
- 内存使用：< 100MB 为健康

### 生产环境建议
- 使用 React DevTools Profiler
- 监控 Core Web Vitals
- 实施错误边界

## 🛠️ 调试工具

### 1. React DevTools
- Profiler 标签页分析渲染性能
- Components 标签页检查组件树

### 2. Chrome DevTools
- Performance 标签页分析运行时性能
- Memory 标签页检查内存泄漏

### 3. Next.js 分析
```bash
# 构建时分析
npm run build
npm run analyze
```

## ⚡ 快速检查清单

- [ ] 所有图表组件使用懒加载
- [ ] 大量数据使用分页或虚拟化
- [ ] 图片使用适当的格式和尺寸
- [ ] API响应时间 < 200ms
- [ ] 首屏渲染时间 < 1s
- [ ] 无内存泄漏
- [ ] 无无限循环

## 🚨 常见性能问题

### 1. 无限重新渲染
```javascript
// ❌ 错误：依赖项包含对象
useEffect(() => {
  // ...
}, [objectData]);

// ✅ 正确：使用稳定的依赖项
useEffect(() => {
  // ...
}, [objectData.id, objectData.name]);
```

### 2. 大量DOM操作
```javascript
// ❌ 错误：同步大量DOM操作
data.forEach(item => {
  document.getElementById('list').innerHTML += `<div>${item}</div>`;
});

// ✅ 正确：使用React的虚拟DOM
return data.map(item => <div key={item.id}>{item}</div>);
```

### 3. 内存泄漏
```javascript
// ❌ 错误：忘记清理定时器
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  // 忘记清理
}, []);

// ✅ 正确：清理定时器
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```
