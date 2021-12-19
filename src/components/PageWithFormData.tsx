import React, { useCallback, useEffect, useState } from 'react'
import { 
    DeleteOutlined, 
    EditOutlined, 
    PlusOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined 
} from '@ant-design/icons'
import {
  Button, 
  Col,
  Divider, 
  Drawer,
  Form,
  Row,
  Space, 
  Table,
  Popconfirm,
  notification,
  Alert,
  Pagination
} from 'antd'
import LayoutFull from '../components/LayoutFull'
import api from '../services/api'
import moment from 'moment'

interface PageWithFormDataProps{
    columns: any[];
    url: string;
    page: {
        title: string
    };
    children: any;
    buttonActions?: boolean;
}

const PageWithFormData: React.FC<PageWithFormDataProps> = ({
    columns, url, page, children, buttonActions = true
}) => {
    
    const [drawerTitle, setDrawerTitle] = useState('');

    const [showDrawer, setShowDrawer] = useState(false)
    const [form] = Form.useForm()

    const [currentPage, setCurrentPage] = useState(1)
    const [dataTable, setDataTable] = useState([])
    const [pagination, setPagination] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const getData = useCallback( () => {
        setLoading(true)
        api.get(url, {params: {page: currentPage}}).then( response => {
            setPagination(response.data.meta)
            setDataTable(response.data.data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [url, currentPage])

    const onChangePage = (page: number) =>{
        setCurrentPage(page)
    }
    
    const hidrateFormWithValues = useCallback((values: any) => {

        if(values.birthday)
            values.birthday = moment(values.birthday, 'YYYY-MM-DD')

        if(values.susbcription_at)
            values.susbcription_at = moment(values.susbcription_at, 'YYYY-MM-DD')
        
        form.setFieldsValue(values)
        setShowDrawer(true)
        setDrawerTitle('Editar cadastro')
        setErrors([])

    },[form])
    
    const remove = useCallback(async (id: string) => {
        await api.delete(`${url}/${id}`).then( response => {
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
    }, [url, getData])
  
    const openDrawer = () => {
        setErrors([])        
        form.resetFields()
        setShowDrawer(true)        
        setDrawerTitle('Novo cadastro')
    }

    async function saveOrCreate(values: any){
    
        if(values.birthday)
            values.birthday = moment(values.birthday).format('YYYY-MM-DD').toString()        
    
        if(values.susbcription_at)
            values.susbcription_at = moment(values.susbcription_at).format('YYYY-MM-DD').toString()
        
        setLoading(true)
        if(values.id){
            await api.put(`${url}/${values.id}`, values).then( response => {
                setLoading(false)
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro atualizado com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
            }).catch( error => {
                setLoading(false)
                setErrors(error?.response?.data?.errors)
            })
        }else{
            await api.post(url, values).then( response => {
                setLoading(false)
                setShowDrawer(false);
                getData()
                notification.open({
                    message: 'Sucesso',
                    description: 'Registro inserido com sucesso',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />
                });
            }).catch( error => {  
                setLoading(false)     
                setErrors(error?.response?.data?.errors)
            })
        }
    }   

    useEffect( () => { 
        if(buttonActions){
            columns.push({
                title: 'Ações',
                key: 'actions',
                render: (text: any, record: any) => (
                    <Space size="middle">
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
            }) 
        }             
        getData()
    }, [getData, buttonActions, columns, hidrateFormWithValues, remove])
    

    return(        
        <LayoutFull>
                <Row>
                    <Col span={21}>
                        <h2>{page.title}</h2>
                    </Col>
                    {buttonActions && (
                        <Col span={3} style={{justifyContent: 'flex-end', display: 'flex'}}>
                            <Button type="primary" block onClick={openDrawer}>
                                <PlusOutlined />{ ' ' }Novo
                            </Button>
                        </Col>
                    )}
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
                        {children}
                        <Row gutter={16}>
                            <Col span={24}>
                                <Button onClick={() => setShowDrawer(false)} style={{ marginRight: 8 }} htmlType="button">
                                    Cancelar
                                </Button>
                                <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
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

export default PageWithFormData