import {
    CheckCircleOutlined, 
    CloseCircleOutlined,
    AppstoreOutlined,
    UserOutlined,
    DollarCircleOutlined,
    DeleteOutlined,
    UnorderedListOutlined,
    CommentOutlined
} from '@ant-design/icons'
import { Alert, Button, Col, Divider, Drawer, Form, Input, Modal, notification, Pagination, Popconfirm, Progress, Row, Select, SelectProps, Space, Spin, Steps, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import LayoutFull from '../components/LayoutFull'
import { Tabs } from 'antd'
import api from '../services/api'

const QuotationDetails: React.FC = ({match}: any) => {

    const params = match.params;

    const { Step } = Steps
    const { Option } = Select

    const { TabPane } = Tabs
    const [currentStep, setCurrentStep] = useState(0)
    const [productList, setProductList] = useState<any>([])
    const [dataTableItemsPrices, setDataTableItemsPrices] = useState<any>([])
    const [showDrawerDetailsPrice, setShowDrawerDetailsPrice] = useState(false)
    const [itemPrice, setItemPrice] = useState<any>({})

    const [sellerList, setSellerList] = useState<any>([])

    const [quotationDetails, setQuotationDetails] = useState<any>({})

    const [loading, setLoading] = useState(false)
    
    const getData = useCallback(() => {
        setLoading(true)
        api.get(`quotation/${params.id}`).then( response => {
            setQuotationDetails(response?.data?.quotation)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const addItem = (values: any) => {
        setLoading(true)
        api.post('quotation-item', {
            quotation_id: params.id,
            product_id: values.product_id,
            quantity: values.quantity,
            unity: 'UN'
        }).then( response => {                
            getData()
            notification.open({
                message: 'Sucesso',
                description: 'Produto adicionado com sucesso',
                icon: <CheckCircleOutlined style={{ color: 'green' }} />
            })
        }).catch( error => {       
            console.log(error?.response?.data?.errors)
        })
    }

    const deleteItem = (id: string) => {
        setLoading(true)
        api.delete(`quotation-item/${id}`).then( response => {                
            getData()
            notification.open({
                message: 'Sucesso',
                description: 'Produto removido com sucesso',
                icon: <CheckCircleOutlined style={{ color: 'green' }} />
            })
        }).catch( error => {       
            console.log(error?.response?.data?.errors)
        })
    }

    const searchProducts = (query: string) => {
        api.get('product').then( response => {                
            setProductList(response?.data?.data)
        }).catch( error => {       
            console.log(error?.response?.data)
        })
    }

    const searchSellers = (query: string) => {
        api.get('company-seller').then( response => {                
            setSellerList(response?.data?.data)
        }).catch( error => {       
            console.log(error?.response?.data)
        })  
    }

    const addSeller = (seller: any) => {
        api.post('quotation-seller', {
            company_seller_id: seller.company_seller_id, 
            quotation_id: params.id           
        }).then( response => {                
            getData()
        }).catch( error => {       
            console.log(error?.response?.data)
        }) 
    }

    const handleOpenDetailsPrice = (item: any) => {
        setShowDrawerDetailsPrice(true)
        api.get(`quotation-item/${item.id}/prices`).then(response => {
            item.prices = response.data
            setItemPrice(item)
        }).catch(error => {
            console.log(error)
        })
    }

    const finalizeQuotation = () => {

        Modal.confirm({
            title: 'Aten????o',
            content: 'Deseja realmente finalizar esta cota????o? N??o ser?? permitido que vendedores/fornecedores incluam novos pre??os',
            okText: 'Sim, finalizar',
            cancelText: 'N??o',
            onOk(){
                api.put(`qutation/${params.id}`, {status: 'FINALIZED'}).then( response => {
                    notification.open({
                        message: 'A????o executada com sucesso',
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
            }
        });

    }
    
    const cancelQuotation = () => {

        Modal.confirm({
            title: 'Aten????o',
            content: 'Deseja realmente cancelar esta cota????o? N??o ser?? permitido que vendedores/fornecedores incluam novos pre??os',
            okText: 'Sim, cancelar',
            cancelText: 'N??o',
            onOk(){
                api.put(`qutation/${params.id}`, {status: 'CANCELLED'}).then( response => {
                    notification.open({
                        message: 'A????o executada com sucesso',
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
            }
        });

    }
    
    useEffect(() => {         
        getData()
    }, [])

    return (
        <LayoutFull>  
            <Row>
                <Col span={24}>
                    {(quotationDetails.status === 'FINALIZED') && (
                        <Alert
                            message="Cota????o aprovada"
                            description="Parab??ns! Voc?? j?? pode gerar as guias de compra e enviar para seus fornecedores/vendedores."
                            type="success"
                            showIcon
                        />
                    )}
                    {(quotationDetails.status === 'CANCELLED') && (
                        <Alert
                            message="Cota????o cancelada"
                            description="Esta cota????o est?? cancelada e n??o pode mais receber atualiza????es."
                            type="error"
                            showIcon
                        />
                    )}
                    {(quotationDetails.status === 'NEGOTIATION') && (
                        <Alert
                            message="Cota????o em negocia????o"
                            description="Esta cota????o est?? aberta para negocia????es."
                            type="info"
                            showIcon
                        />
                    )}
                </Col>
                <Col span={18}>
                    <h2>Detalhes da cota????o</h2>
                </Col>
                <Col span={3}>                
                    <Button type="primary" onClick={() => finalizeQuotation()} style={{backgroundColor: 'green', border: 'none'}}>
                        <CheckCircleOutlined />{ ' ' } Finalizar cota????o
                    </Button>
                </Col>
                <Col span={3}>                
                    <Button type="primary" onClick={() => cancelQuotation()} style={{backgroundColor: 'red', border: 'none'}}>
                        <CloseCircleOutlined />{ ' ' } Cancelar cota????o
                    </Button>
                </Col>
            </Row>                      
            <Row>
                <Col span={24}>
                    <Steps current={currentStep} onChange={setCurrentStep}>
                        <Step icon={<AppstoreOutlined />} title="Rela????o de itens" description="Produtos nesta cota????o" />
                        <Step icon={<UserOutlined />} title="Rela????o de vendedores" description="Vendedores nesta cota????o" />
                        <Step icon={<DollarCircleOutlined />} title="Mapa de pre??os" description="Confira os pre??os em tempo real" />
                    </Steps>                
                </Col>
                <Col span={24}>
                    <Row className="steps-content" style={{padding: 10}}>
                        {(currentStep === 0) && (
                            <Col span={24}>
                                    <Form
                                        layout="vertical"
                                        onFinish={addItem}
                                    >
                                        <Row gutter={15}>
                                            <Col span={10}>
                                                <Form.Item    
                                                    label="Selecione o produto"                                        
                                                    name="product_id"
                                                    rules={[{ required: true, message: 'Campo obrigat??rio' }]}
                                                >
                                                    <Select
                                                        labelInValue={false}
                                                        placeholder="Digite o nome do produto para buscar..."
                                                        notFoundContent={!productList ? <Spin size="small" /> : <div>Nenhum dado encontrado</div>}
                                                        filterOption={false}
                                                        onSearch={(value) => searchProducts(value)}
                                                        style={{ width: '100%' }}
                                                        showSearch
                                                        allowClear
                                                    >
                                                        {productList.map((item: any) => (
                                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={3}>
                                                <Form.Item
                                                    name="quantity"
                                                    label="Quantidade"
                                                    rules={[{required: true, message: 'Campo obrigat??rio'}]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                                <Form.Item style={{marginTop: 30}}>
                                                    <Button type="primary" block htmlType="submit"> + Incluir</Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                <Row>
                                    <Col span={24}>
                                        <Table 
                                            columns={[
                                                {
                                                    title: 'Nome',
                                                    key: 'product',
                                                    dataIndex: 'product',
                                                    render: (text: any, record: any) => {
                                                      return record.product.name
                                                    },
                                                    sorter: (a: any, b: any) => a.product.name - b.product.name,
                                                  },
                                                  {
                                                    title: 'Quantidade',
                                                    dataIndex: 'quantity',
                                                    key: 'quantity',
                                                    render: (text: any, record: any) => {
                                                      return record.quantity
                                                    },
                                                    sorter: (a: any, b: any) => a.quantity - b.quantity,
                                                  },
                                                  {
                                                      title: 'A????es',
                                                      key: 'actions',
                                                      render: (text: any, record: any) => (
                                                          <Space size="small">
                                                              <Popconfirm
                                                                  title="Deseja realmente excluir esse item?"
                                                                  onConfirm={() => deleteItem(record.id)}
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
                                            ]} 
                                            dataSource={quotationDetails.quotationItems} 
                                            rowKey={() => Math.random()} 
                                            loading={loading}
                                            pagination={false}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {(currentStep === 1) && (
                            <Col span={24}>
                                <Form
                                    layout="vertical"
                                    onFinish={addSeller}
                                >
                                    <Row gutter={15}>
                                        <Col span={12}>
                                            <Form.Item  
                                                label="Selecione o vendedor"                                          
                                                name="company_seller_id"
                                                rules={[{ required: true, message: 'Campo obrigat??rio' }]}
                                            >  
                                                <Select
                                                    labelInValue={false}
                                                    placeholder="Digite o nome do vendedor para buscar..."
                                                    notFoundContent={!sellerList ? <Spin size="small" /> : <div>Nenhum dado encontrado</div>}
                                                    filterOption={false}
                                                    onSearch={(value) => searchSellers(value)}
                                                    style={{ width: '100%' }}
                                                    showSearch
                                                    allowClear
                                                >
                                                    {sellerList.map((item: any) => (
                                                        <Option key={item.id} value={item.id}>{item?.user?.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item style={{marginTop: 30}}>
                                                <Button type="primary" block htmlType="submit"> + Incluir</Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item style={{marginTop: 30}}>
                                                <Button type="default" block htmlType="submit">Enviar SMS para todos</Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                                <Row>
                                <Col span={24}>
                                    <Table 
                                        columns={[
                                            {
                                                title: 'Nome',
                                                key: 'name',
                                                width: '80%',
                                                dataIndex: 'name',
                                                    render: (text: any, record: any) => {
                                                        return record?.companySeller?.user?.name
                                                    },
                                                },
                                            {
                                                title: 'A????es',
                                                key: 'actions',
                                                width: '20%',
                                                align: 'center',
                                                render: (text: any, record: any) => (
                                                    <Space size="small">
                                                        
                                                        <Button type="link" style={{color: 'blue'}} >
                                                            <CommentOutlined />{ ' ' } Enviar SMS
                                                        </Button>

                                                        <Divider />
                                                        <Popconfirm
                                                            title="Deseja realmente excluir esse item?"
                                                            onConfirm={() => {}}
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
                                        ]} 
                                        dataSource={quotationDetails.quotationSellers} 
                                        rowKey={() => Math.random()} 
                                        loading={loading}
                                        pagination={false}
                                    />
                                </Col>
                            </Row>
                            </Col>
                        )}
                        {(currentStep === 2) && (
                            <Col span={24}>
                                <Table 
                                    columns={[
                                        {
                                            title: 'Nome',
                                            dataIndex: 'name',
                                            key: 'name',
                                            render: (text: any, record: any) => {
                                                return `${record.barcode} - ${record.name}`
                                            },
                                            sorter: (a: any, b: any) => a.name - b.name,
                                        },
                                        {
                                            title: 'UN',
                                            dataIndex: 'unity',
                                            key: 'unity',
                                            render: (text: any, record: any) => {
                                                return record.unity
                                            },
                                            sorter: (a: any, b: any) => a.unity - b.unity,
                                        },
                                        {
                                            title: 'QTD',
                                            dataIndex: 'quantity',
                                            key: 'quantity',
                                            render: (text: any, record: any) => {
                                                return record.quantity
                                            },
                                            sorter: (a: any, b: any) => a.quantity - b.quantity,
                                        },
                                        {
                                            title: 'Menor Pre??o',
                                            dataIndex: 'minor_price',
                                            key: 'minor_price',
                                            render: (text: any, record: any) => {
                                                return record.minor_price
                                            },
                                            sorter: (a: any, b: any) => a.minor_price - b.minor_price,
                                        },
                                        {
                                            title: 'Maior Pre??o',
                                            dataIndex: 'major_price',
                                            key: 'major_price',
                                            render: (text: any, record: any) => {
                                                return record.major_price
                                            },
                                            sorter: (a: any, b: any) => a.major_price - b.major_price,
                                        },
                                        {
                                            title: 'A????es',
                                            key: 'actions',
                                            render: (text: any, record: any) => (
                                                <Space size="small">
                                                    <Button type="link" style={{color: 'blue'}} onClick={() => handleOpenDetailsPrice(record)} >
                                                        <UnorderedListOutlined />{ ' ' }Detalhes
                                                    </Button>
                                                    <Divider type="vertical" />
                                                    <Popconfirm
                                                        title="Deseja realmente excluir esse item?"
                                                        onConfirm={() => {}}
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
                                    ]} 
                                    dataSource={dataTableItemsPrices} 
                                    rowKey={() => Math.random()} 
                                    loading={loading}
                                    pagination={false}
                                />
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
            <Drawer
                title="Detalhes do item"
                width={800}
                onClose={() => setShowDrawerDetailsPrice(false)}
                maskClosable={false}
                visible={showDrawerDetailsPrice}
                bodyStyle={{ paddingBottom: 80 }}
            >
            <Row>
                <Col span={8}>
                    <label>Nome produto: <br/> 
                        <strong>{itemPrice.name}</strong>
                    </label>
                </Col>
                <Col span={8}>
                    <label>C??digo de barras: <br/> 
                        <strong>{itemPrice.barcode}</strong>
                    </label>
                </Col>
                <Col span={8}>
                    <label>Unidade: <br/> 
                        <strong>{itemPrice.unity}</strong>
                    </label>
                </Col>
            </Row>
                <Row>
                    <Col span={24} style={{marginTop: 25}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Resumo" key="1">
                            <Row gutter={15}>
                                <Col span={8}>
                                    <h4>Menor pre??o</h4>
                                    <h1 style={{color: '#4ad395'}}>R$ {itemPrice.minor_price}</h1>
                                </Col>
                                <Col span={8}>
                                    <h4>Maior pre??o</h4>
                                    <h1 style={{color: '#cb2027'}}>R$ {itemPrice.major_price}</h1>
                                </Col>
                                <Col span={24}>
                                    <Divider />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Pre??os Vendedores" key="3"> 
                                        
                            <Row gutter={15}>                                
                                <Col span={8}>
                                    <h5>Fornecedor</h5><br/>
                                </Col>                                  
                                <Col span={4}>
                                    <h5>Pre??o</h5><br/>
                                </Col>                               
                                <Col span={4}>
                                    <h5>Solicitado</h5><br/>
                                </Col>
                                <Col span={4}>
                                    <h5>Dispon??vel</h5><br/>
                                </Col>
                                <Col span={4}>
                                    <h5>Atendido</h5><br/></Col>
                            </Row>
                            {itemPrice?.prices?.map((element: any) => (                
                                <Row gutter={15}>                                
                                    <Col span={8}>
                                        <big>{element.user?.name}</big>
                                    </Col>                                  
                                    <Col span={4}>
                                        <big><strong>R$</strong> {element.price}</big>
                                    </Col>                               
                                    <Col span={4}>
                                        <big>{element?.quotationItem?.quantity} <strong>{element?.quotationItem?.unity}</strong></big>
                                    </Col>
                                    <Col span={4}>
                                        <big>{element.quantity_available} <strong>{element.unity}</strong></big>
                                    </Col>
                                    <Col span={4}>
                                        <Progress type="line" percent={(Number(element.quantity_available) * 100 / Number(element?.quotationItem?.quantity))} width={40} strokeColor="#4ad395"/>
                                    </Col>
                                </Row>
                            ))}    
                        </TabPane>
                    </Tabs>
                    </Col>
                </Row>
            </Drawer>
        </LayoutFull>  
    )

}

export default QuotationDetails


