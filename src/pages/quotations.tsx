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
import { NavLink } from 'react-router-dom'


const Quotations: React.FC = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [dataTable, setDataTable] = useState<any>([])
    const [pagination, setPagination] = useState<any>({})
    const [loading, setLoading] = useState(false)
    
    const columns: any[] = [
        {
          title: 'Comprador',
          key: 'user',
          dataIndex: 'user',
          ellipsis: 'enable',
          render: (text: any, record: any) => {
            return record?.user?.name
          },
          sorter: (a: any, b: any) => a?.user?.name - b?.user?.name,
        },
        {
          title: 'Criado em',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (text: any, record: any) => {
            return record.created_at
          },
          sorter: (a: any, b: any) => a.created_at - b.created_at,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text: any, record: any) => {
            return record.status
          },
          sorter: (a: any, b: any) => a.status - b.status,
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Divider type="vertical" />
                    <NavLink to={`quotations/${record.id}`}>
                        <EditOutlined />{ ' ' } Abrir
                    </NavLink>
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
        setPagination([])
        api.get('quotation', {params: {page: currentPage}}).then( response => {
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
    
    const remove = useCallback(async (id: string) => {
        await api.delete(`quotation/${id}`).then( response => {
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

    async function create(){
        setLoading(true)
        api.post('quotation', {status: 'OPENED'}).then( response => {            
            
            window.location.href=`/quotations/${response.data.id}`

            notification.open({
                message: 'Sucesso',
                description: 'Registro inserido com sucesso',
                icon: <CheckCircleOutlined style={{ color: 'green' }} />
            });

            setLoading(false)
        }).catch( error => {       
            setLoading(false)
        })
    }   

    useEffect(() => {         
        getData()
    }, [getData])

    return (
        <LayoutFull>  
            <Row>
                <Col span={21}>
                    <h2>Cotações cadastradas</h2>
                </Col>
                <Col span={3} style={{justifyContent: 'flex-end', display: 'flex'}}>
                    <Button type="primary" block onClick={create}>
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
        </LayoutFull>  
    )

}

export default Quotations;