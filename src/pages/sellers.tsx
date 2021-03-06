import { 
    DeleteOutlined, 
    EditOutlined, 
    PlusOutlined,
    CheckCircleOutlined, 
    FileDoneOutlined,
    CloseCircleOutlined 
  } from '@ant-design/icons'
  import { Alert, Button, Col, Divider, Drawer, Form, Input, notification, Pagination, Popconfirm, Row, Select, Space, Spin, Table } from 'antd'
  import React, { useCallback, useEffect, useState } from 'react'
  import LayoutFull from '../components/LayoutFull'
  import api from '../services/api'
  
  const Sellers: React.FC = () => {
        
    const { Option } = Select

    const [drawerTitle, setDrawerTitle] = useState('');
  
    const [showDrawer, setShowDrawer] = useState(false)
    const [form] = Form.useForm()
  
    const [currentPage, setCurrentPage] = useState(1)
    const [dataTable, setDataTable] = useState([])
    const [pagination, setPagination] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
  
    const columns: any = [
        {
            key: 'name',
            title: 'Nome',
            dataIndex: 'name',
            render: (text: any, record: any) => {
                return record.user?.name
            },
            sorter: (a: any, b: any) => a.user?.name - b.user?.name,
        },
        {
            key: 'phone',
            title: 'Fone',
            dataIndex: 'phone',
            render: (text: any, record: any) => {
                return record.user?.phone
            },
            sorter: (a: any, b: any) => a.user?.phone.length - b.user?.phone.length,
        },
        {
            dataIndex: 'email',
            title: 'E-mail',
            key: 'email',
            render: (text: any, record: any) => {
                return record.user?.email
            },
            sorter: (a: any, b: any) => a.user?.email - b.user?.email,
        },
        {
            title: 'Ativo',
            dataIndex: 'active',
            key: 'active',
            render: (text: any, record: any) => {
                return (text) ? 'Ativo' : 'Desativado'
            },
            sorter: (a: any, b: any) => a.active - b.active,
        },
        {
            title: 'A????es',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button type="link" onClick={() => hidrateFormWithValues(record)}>
                        <EditOutlined />{ ' ' }Editar
                    </Button>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Deseja realmente excluir esse registro?"
                        onConfirm={() => remove(record.id)}
                        okText="Sim"
                        cancelText="N??o"
                    >
                        <Button type="link" style={{color: 'red'}} >
                            <DeleteOutlined />{ ' ' }Excluir
                        </Button>
                    </Popconfirm>                
                </Space>
            ),
        }    
    ]
    
    const getData = useCallback( () => {
      setLoading(true)
      api.get('company-seller', {params: {page: currentPage}}).then( response => {
          setPagination(response.data.meta)
          setDataTable(response.data.data)
          setLoading(false)
      }).catch(() => {
          setLoading(false)
      })
    }, [currentPage])
  
    const onChangePage = (page: number) =>{
      setCurrentPage(page)
    }
    
    const hidrateFormWithValues = useCallback((values: any) => {
        form.setFieldsValue(values)
        setShowDrawer(true)
        setDrawerTitle('Editar cadastro')
        setErrors([])
  
    },[form])
      
    const remove = useCallback(async (id: string) => {
        await api.delete(`company-seller/${id}`).then( response => {
            notification.open({
                message: 'A????o executada com sucesso',
                description: 'Registro excluido com sucesso',
                icon: <CheckCircleOutlined style={{ color: 'green' }} />
            });
            getData()
        }).catch( error => {            
            notification.open({
                message: 'Ops, ocorreu um erro',
                description: error?.response?.data?.message,
                icon: <CloseCircleOutlined style={{ color: 'red' }} />
            });
        })
    }, [getData])
  
    const openDrawer = () => {
        setErrors([])        
        form.resetFields()
        setShowDrawer(true)        
        setDrawerTitle('Novo cadastro')
    }
  
    async function saveOrCreate(values: any){
        if(values.id){
              setLoading(true)
            await api.put(`company-seller/${values.id}`, values).then( response => {
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro atualizado com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
                setLoading(false)
            }).catch( error => {
                  setLoading(false)
                  setErrors(error?.response?.data?.errors)
            })
        }else{
              delete values.id
              setLoading(true)
              api.post('company-seller', values).then( response => {
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro inserido com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
                setLoading(false)
            }).catch( error => {
                  setLoading(false)       
                  setErrors(error?.response?.data?.errors)
            })
        }
    }   
  
    useEffect(() => {    
        getData()
    }, [getData])
  
    return(
      <LayoutFull> 
        <Row>
            <Col span={21}>
                <h2>Vendedores/Fornecedores</h2>
            </Col>
            <Col span={3} style={{justifyContent: 'flex-end', display: 'flex'}}>
                <Button type="primary" block onClick={openDrawer}>
                    <PlusOutlined />{ ' ' }Novo
                </Button>
            </Col>
        </Row>           
        <Table 
            columns={columns} 
            dataSource={dataTable} 
            rowKey={() => Math.random()} 
            loading={loading}
            pagination={false}
        />
        <Pagination 
            pageSize={20}
            style={{float: 'right', margin: '5px'}}
            current={currentPage} 
            onChange={onChangePage} 
            total={pagination.total}                    
            showTotal={total => `Total ${total} registros`}
        />  
        <Drawer
          title={drawerTitle}
          width={720}
          onClose={() => setShowDrawer(false)}
          maskClosable={false}
          visible={showDrawer}
          bodyStyle={{ paddingBottom: 80 }}
        >  <Form 
              layout="vertical" 
              form={form} 
              hideRequiredMark 
              onFinish={saveOrCreate}
              initialValues={{
                  id: ''
              }}
          >
            <Row gutter={16}>
                <Form.Item name="id" style={{display: 'none'}}>
                  <Input readOnly name="id" />
                </Form.Item>
                <Col span={18}>
                    <Form.Item
                      name="name"
                      label="Nome"
                      rules={[{ required: true, message: 'Obrigat??rio' }]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                      name="phone"
                      label="Fone"
                      rules={[{ required: true, message: 'Obrigat??rio' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                      name="active"
                      label="Ativo"
                      rules={[{ required: true, message: 'Obrigat??rio' }]}
                    >
                    <Select placeholder="Status">
                        <Option value="true">Ativo</Option>
                        <Option value="false">Bloqueado</Option>
                    </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Button onClick={() => setShowDrawer(false)} style={{ marginRight: 8 }} htmlType="button">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Salvar
                    </Button>
                </Col>
            </Row>  
            <ul style={{listStyle: 'none'}}>
                {errors.map((item: any) => (                        
                    <li>
                        <Alert message={item?.message} type="error" style={{marginTop: 10}}/>                            
                    </li>                        
                ))}
            </ul>        
            </Form>
        </Drawer>   
      </LayoutFull>  
    )
  }
  
  export default Sellers