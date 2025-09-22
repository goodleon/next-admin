import { Space, Tag, type TableProps, Modal, message } from 'antd';

interface DataType {
    key: string;
    name: string;
    role: number;
    desc: string;
    tags: string[];
  }
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      fixed: 'left',
      width: 100
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => role === 1 ? '超级管理员' : '开发者'
    },
    {
      title: '简介',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)} style={{ color: 'red' }}>删除</a>
        </Space>
      ),
    },
  ];

  // 处理编辑功能
  const handleEdit = (record: DataType) => {
    Modal.info({
      title: '编辑用户',
      content: (
        <div>
          <p><strong>用户名:</strong> {record.name}</p>
          <p><strong>角色:</strong> {record.role === 1 ? '超级管理员' : '开发者'}</p>
          <p><strong>简介:</strong> {record.desc}</p>
          <p><strong>标签:</strong> {record.tags.join(', ')}</p>
          <p style={{ marginTop: 16, color: '#666' }}>
            这里可以添加编辑表单，目前显示用户信息
          </p>
        </div>
      ),
      width: 500,
      onOk() {
        message.success('编辑功能演示');
      },
    });
  };

  // 处理删除功能
  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${record.name}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        message.success(`用户 "${record.name}" 已删除`);
        // 这里可以添加实际的删除逻辑
        console.log('删除用户:', record);
      },
    });
  };
  
  const data: DataType[] = [
    {
      key: '1',
      name: '徐小夕',
      role: 1,
      desc: 'H5-Dooring作者, 掘金签约作者，知乎专栏作家',
      tags: ['前端工程师', 'developer'],
    },
    {
        key: '2',
        name: '张三',
        role: 2,
        desc: '知乎专栏作家',
        tags: ['前端工程师', 'developer' , 'Dooring'],
    },
    {
        key: '3',
        name: '李盟',
        role: 2,
        desc: 'Dooring共建者',
        tags: ['后端工程师', 'V6.Dooring' , 'Dooring'],
    },
    {
        key: '4',
        name: '王阿明',
        role: 2,
        desc: '技术合伙人',
        tags: ['全栈工程师', '橙子表单'],
    },
    {
        key: '5',
        name: '张小明',
        role: 2,
        desc: '技术合伙人',
        tags: ['全栈工程师', '橙子表单'],
    },
    {
        key: '6',
        name: 'Tom',
        role: 2,
        desc: '技术合伙人',
        tags: ['全栈工程师', 'Next-Admin'],
    },
    {
        key: '7',
        name: 'Json',
        role: 2,
        desc: '技术合伙人',
        tags: ['全栈工程师', 'Next-Admin'],
    },
  ];

  export {
    columns,
    data
  }