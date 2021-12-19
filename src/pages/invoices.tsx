import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined, CheckOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Divider, Drawer, Form, Input, Modal, notification, Pagination, Popconfirm, Row, Space, Table, Tag } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import LayoutFull from '../components/LayoutFull'
import api from '../services/api'

const Invoices: React.FC = () => {

    const [currentPage, setCurrentPage] = useState(0)
    const [dataTable, setDataTable] = useState([])
    const [pagination, setPagination] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [transactionId, setTransactionId] = useState('')
    const [errors, setErrors] = useState([])
    const [isModalAttachamentVisible, setIsModalAttachamentVisible] = useState(false)
    const [modalAttachamentFile, setModalAttachamentFile] = useState('')

    const [fieldFile, setFieldFile] = useState<any>()
    const [showDrawerAttachament, setShowDrawerAttachament] = useState(false)
    const [formAttachament] = Form.useForm()

    const getData = useCallback( () => {
        setLoading(true)
        api.get('invoices', {params: currentPage}).then( response => {
            setPagination(response.data.meta)
            setDataTable(response.data.data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [currentPage])

    const resendBillet = async (id: string) => {
        await api.get(`invoices/${id}/resendBillet`).then( response => {
            notification.open({
                message: 'Ação executada com sucesso',
                description: 'Boleto reenviado para o cliente',
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

    const onChangePage = (page: number) =>{
        setCurrentPage(page)
    }

    const saveAttachament = () => {      
      const data = new FormData();
      data.append('file', fieldFile[0])

      api.put(`invoices/${transactionId}/attachedReceipt`, data).then(response => {
        getData()
        setShowDrawerAttachament(false)
        notification.open({
          message: 'Sucesso',
          description: 'Registro atualizado com sucesso',
          icon: <CheckCircleOutlined style={{ color: 'green' }} />
      });
      }).catch(error => {
        setErrors(error?.response?.data?.errors)
      })
    }

    const setTransactionDrawerId = (id: string) => {
      setTransactionId(id)
      setShowDrawerAttachament(true)
    }
   
    const setIsModalAttachamentOpen = (filePath: string) => {
      setModalAttachamentFile(filePath)
      setIsModalAttachamentVisible(true)
    }

    const columns = [
      {
        key: 'requester',
        title: 'Solicitado por',
        dataIndex: 'requester',
        //ellipsis: 'enable',
        render: (text: any, record: any) => {
          if(record.user){
            return record.user.full_name
          }
          else if(record.student){
            return record.student.full_name
          }              
        }
      },
      {
        title: 'Curso',
        dataIndex: 'course',
        key: 'course',
        //ellipsis: 'enable',
        render: (text: any, record: any) => {
            return record.course.name
        },
        sorter: (a: any, b: any) => a.course.name.length - b.course.name.length,
      },
      {
        title: 'Data/Hora',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: any, record: any) => {
            return moment(record.created_at).format('DD/MM/YYYY')
        },
        sorter: (a: any, b: any) => a.created_at - b.created_at,
      },
      {
        title: 'Forma Pagto',
        dataIndex: 'payment_method',
        key: 'payment_method',
        render: (text: any, record: any) => {
          return (text === 'CREDIT_CARD') ? 'CARTÃO DE CRÉDITO' : 'BOLETO'
        },
        sorter: (a: any, b: any) => a.payment_method - b.payment_method,
      },
      {
        title: 'Valor',
        dataIndex: 'amount',
        key: 'amount',
        render: (text: any, record: any) => {
          return text
        },
        sorter: (a: any, b: any) => a.amount - b.amount,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: any, record: any) => {

          console.log(record.status)

          switch(record.status){
            case 'PENDENT' : 
              return <Tag color="orange">PENDENTE</Tag>
            case 'PAID' : 
              return <Tag color="green">PAGO</Tag>
            case 'REJECTED' : 
              return <Tag color="red">REJEITADO</Tag>
            case 'CANCELLED' : 
              return <Tag color="red">CANCELADO</Tag>
          }
        },
        sorter: (a: any, b: any) => a.active - b.active,
      },
      {
        title: 'Ações',
        key: 'actions',
        render: (text: any, record: any) => (
          <div>
          <Space size="middle">
            {(record.status === 'PENDENT') && (
              <Button 
                type="link" style={{color: 'green'}} 
                onClick={() => setTransactionDrawerId(record.id)}
              >
                <CheckOutlined />{ ' ' }Liberar
              </Button>
            )}
            { (record.attached_receipt) && (
              <Button type="link" style={{color: 'blue'}} onClick={() => setIsModalAttachamentOpen(record.attached_receipt)}>
                <PaperClipOutlined />{ ' ' } Anexo
              </Button>
            )}
            {(!record.attached_receipt && record.status !== 'PENDENT') && (
              <div style={{width: 95, fontStyle: 'italic', color: '#999', textAlign: 'center'}}>Confirmado</div>
            )}
              <Divider type="vertical" />
              <Popconfirm
                title="Confirma o reenvio do link?"
                onConfirm={() => resendBillet(record.id)}
                okText="Sim"
                cancelText="Não"
              >
                <Button type="link" style={{color: 'blue', float: 'right'}} >
                  <MailOutlined />{ ' ' }Reenviar boleto
                </Button>
              </Popconfirm>                
          </Space>  
          </div>
        ),
      }
    ];

    useEffect( () => {        
        getData()
    }, [getData])

    return(        
        <LayoutFull>
            <Row>
                <Col span={21}>
                    <h2>Pagamentos</h2>
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
              title="Confirmação manual"
              width={720}
              onClose={() => setShowDrawerAttachament(false)}
              maskClosable={false}
              visible={showDrawerAttachament}
              bodyStyle={{ paddingBottom: 80 }}
            >
              <Form 
                layout="vertical" 
                form={formAttachament} 
                hideRequiredMark 
                onFinish={saveAttachament}
                initialValues={{
                    id: ''
                }}
              >
                <Row gutter={16}>
                  <Col span={10}>
                      <Form.Item
                          name="file"
                          label="Comprovante de pagamento"
                          rules={[{ required: true, message: 'Obrigatório' }]}
                      >
                          <Input 
                              type="file"  
                              onChange={(event) => {
                                  setFieldFile(event.currentTarget.files);
                              }}
                          />
                      </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Button onClick={() => setShowDrawerAttachament(false)} style={{ marginRight: 8 }} htmlType="button">
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
                  
          <Modal 
            title="Comprovante de pagamento" 
            visible={isModalAttachamentVisible} 
            footer={false} 
            onCancel={() => setIsModalAttachamentVisible(false)}
          >
            <img src={`${process.env.REACT_APP_URL_AWS_BUCKET}${modalAttachamentFile}`} style={{width: '100%'}} alt=""/>
          </Modal>          
        </LayoutFull>
    )

}

export default Invoices;