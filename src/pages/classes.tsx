import { Alert, Button, Col, Divider, Drawer, Form, Input, notification, Pagination, Popconfirm, Row, Select, Space, Spin, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { 
    DeleteOutlined, 
    EditOutlined, 
    PlusOutlined,
    CheckCircleOutlined, 
    FileDoneOutlined,
    CloseCircleOutlined 
} from '@ant-design/icons'
import LayoutFull from '../components/LayoutFull'
import api from '../services/api'


const Classes: React.FC = () => {

    const { Option } = Select
    const [courseList, setCourseList] = useState<any>([]);

    const [drawerTitle, setDrawerTitle] = useState('');

    const [showDrawer, setShowDrawer] = useState(false)
    const [form] = Form.useForm()

    const [currentPage, setCurrentPage] = useState(1)
    const [dataTable, setDataTable] = useState([])
    const [pagination, setPagination] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])
    
    const columns: any[] = [
        {
          title: 'Nome',
          key: 'name',
          dataIndex: 'name',
          ellipsis: 'enable',
          sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
        {
          title: 'Curso',
          dataIndex: 'course',
          key: 'course',
          render: (text: any, record: any) => {
            return record.course.name
          },
          sorter: (a: any, b: any) => a.active - b.active,
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <a href={`${process.env.REACT_APP_HOST}frequencylistgenerate/${record.id}`} target="_blank" rel="noreferrer">
                        <FileDoneOutlined />{ ' ' }Frequência
                    </a>
                    <Divider type="vertical" />
                    <Button type="link" onClick={() => hidrateFormWithValues(record)}>
                        <EditOutlined />{ ' ' }Editar
                    </Button>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Deseja realmente excluir esse item?"
                        onConfirm={() => remove(record.id)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button type="link" style={{color: 'red'}} >
                            <DeleteOutlined />{ ' ' }Excluir
                        </Button>
                    </Popconfirm>                
                </Space>
            ),
        }
    ];

    const getData = useCallback( () => {
        setLoading(true)
        api.get('schoolclasses', {params: {page: currentPage}}).then( response => {
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
        await api.delete(`schoolclasses/${id}`).then( response => {
            notification.open({
                message: 'Ação executada com sucesso',
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
            await api.put(`schoolclasses/${values.id}`, values).then( response => {
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro atualizado com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
            }).catch( error => {
                setErrors(error?.response?.data?.errors)
            })
        }else{
            await api.post('schoolclasses', values).then( response => {
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro inserido com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
            }).catch( error => {       
                setErrors(error?.response?.data?.errors)
            })
        }
    }   

    useEffect(() => {         
        getData()
    }, [getData])
    
    const searchCurses = (searchText: string) => {
        if(!searchText)
            return false
        
        api.get('courses').then((response: any) => {
            const items = response.data.data.map((item: any) => {
                return {id: item.id, name: item.name}
            })
            setCourseList(items)
        }).catch( (error: any) => {
            console.log(error)
        })        
    }

    return (
        <LayoutFull>  
            <Row>
                <Col span={21}>
                    <h2>Turmas cadastradas</h2>
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
                >
                    <Form 
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
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Nome da turma"
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="course_id"
                                    label="Nome do curso"
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                    <Select
                                        labelInValue={false}
                                        placeholder="Digite o nome do curso para buscar..."
                                        notFoundContent={!courseList ? <Spin size="small" /> : <div>Nenhum dado encontrado</div>}
                                        filterOption={false}
                                        onSearch={(value) => searchCurses(value)}
                                        style={{ width: '100%' }}
                                        showSearch
                                        allowClear
                                    >
                                    {courseList.map((item: any) => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                    </Select>
                                </Form.Item>
                            </Col>                
                            <Col span={8}>                
                                <Form.Item
                                    name="location"
                                    label="Cidade onde foi realizado"
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                    <Input placeholder="ex.: Barreiras-BA"/>
                                </Form.Item>
                            </Col>  
                            <Col span={8}>                
                                <Form.Item
                                    name="period"
                                    label="Período"                        
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                    <Input placeholder="ex.: 11, 12 e 13 de janeiro" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="active"
                                    label="Status"
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                <Select placeholder="Status">
                                    <Option value="true">Ativo</Option>
                                    <Option value="false">Inativo</Option>
                                </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Button onClick={() => setShowDrawer(false)} style={{ marginRight: 8 }} htmlType="button">
                                    Cancelar
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Salvar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <ul style={{listStyle: 'none'}}>
                        {errors.map((item: any) => (                        
                            <li>
                                <Alert message={item?.message} type="error" style={{marginTop: 10}}/>                            
                            </li>                        
                        ))}
                    </ul>
                </Drawer>  
        </LayoutFull>  
    )

}

export default Classes