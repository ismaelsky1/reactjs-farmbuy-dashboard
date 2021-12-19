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

const Users: React.FC = () => {
      
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
      key: 'full_name',
      title: 'Nome',
      dataIndex: 'full_name',
      sorter: (a: any, b: any) => a.full_name.length - b.full_name.length,
    },
    {
      key: 'email',
      title: 'E-mail',
      dataIndex: 'email',
      sorter: (a: any, b: any) => a.email - b.email,
    },
    {
      title: 'Perfil',
      dataIndex: 'profile',
      key: 'profile',
      render: (text: any, record: any) => {
        switch(record.profile){
          case 'ADMIN':
            return 'Administrador'
          case 'SUBSCRIBER':
            return 'Assinante'
          case 'FRANCHISEE':
            return 'Franqueado'
        }
      },
      sorter: (a: any, b: any) => a.active - b.active,
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
      title: 'Ações',
      key: 'actions',
      render: (text: any, record: any) => (
          <Space size="small">
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
  ]

  const [companyList, setCompanyList] = useState<any>([]);

  const searchCompanies = (searchText: string) => {
        if(!searchText)
            return false
        
        api.get('company').then(response => {
            const items = response.data.data.map((item: any) => {
                return {id: item.id, name: item.fantasy_name}
            })
            setCompanyList(items)
        }).catch( error => {
            console.log(error)
        })        
  }
  
  const getData = useCallback( () => {
    setLoading(true)
    api.get('user', {params: {page: currentPage}}).then( response => {
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
      await api.delete(`user/${id}`).then( response => {
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
            setLoading(true)
          await api.put(`user/${values.id}`, values).then( response => {
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
                if(error?.response?.data?.errors)
                    setErrors(error?.response?.data?.errors)

                console.log(error?.response?.data)
          })
      }else{
            delete values.id
            setLoading(true)
            api.post('user', values).then( response => {
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
                if(error?.response?.data?.errors)
                    setErrors(error?.response?.data?.errors)

                console.log(error?.response?.data)
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
              <h2>Usuários cadastrados</h2>
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
              <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Nome"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                  <Input />
                  </Form.Item>
              </Col>
              <Col span={6}>
                  <Form.Item
                    name="document"
                    label="CPF"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                  <Input />
                  </Form.Item>
              </Col>
              <Col span={6}>
                  <Form.Item
                    name="phone"
                    label="Celular"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                  <Input />
                  </Form.Item>
              </Col>
              <Col span={12}>
                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                      <Input />
                  </Form.Item>
              </Col>
              <Col span={12}>
                  <Form.Item
                    name="company_id"
                    label="Empresa"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                    <Select
                      labelInValue={false}
                      placeholder="Digite o nome do aluno para buscar..."
                      notFoundContent={!companyList ? <Spin size="small" /> : <div>Nenhum dado encontrado</div>}
                      filterOption={false}
                      onSearch={(value) => searchCompanies(value)}
                      style={{ width: '100%' }}
                      showSearch
                      allowClear
                    >
                      {companyList.map((item: any) => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
              </Col>
              <Col span={8}>
                  <Form.Item
                    name="password"
                    label="Senha"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                      <Input />
                  </Form.Item>
              </Col>
              <Col span={8}>
                  <Form.Item
                    name="profile"
                    label="Perfil"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                    >                                           
                        <Option key="ADMIN" value="ADMIN">Administrador</Option>                                         
                        <Option key="SUBSCRIBER" value="SUBSCRIBER">Assinante</Option>                                         
                        <Option key="BUYER" value="BUYER">Comprador</Option>                                         
                        <Option key="SUPPLIER" value="SUPPLIER">Fornecedor</Option>                                         
                    </Select>
                  </Form.Item>
              </Col>
              <Col span={8}>
                  <Form.Item
                    name="active"
                    label="Ativo"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                  >
                  <Select placeholder="Status">
                      <Option value="true">Ativo</Option>
                      <Option value="false">Bloqueado</Option>
                  </Select>
                  </Form.Item>
              </Col>
          </Row>    
          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="address_street"
                    label="Endereço (logradouro)"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Input placeholder="Rua, Av. etc"/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item
                    name="address_number"
                    label="Número"
                >
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="address_neighborhood"
                    label="Bairro"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Input placeholder="Rua, Av. etc"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="address_complement"
                    label="Complemento"
                >
                    <Input placeholder="Casa, Apartamento, Lote, etc"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="address_complement"
                    label="Ponto de referência"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="address_city"
                    label="Cidade"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={5}>
                <Form.Item
                    name="address_state"
                    label="UF"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Select>
                        <Option value="AC">Acre</Option>
                        <Option value="AL">Alagoas</Option>
                        <Option value="AP">Amapá</Option>
                        <Option value="AM">Amazonas</Option>
                        <Option value="BA">Bahia</Option>
                        <Option value="CE">Ceará</Option>
                        <Option value="DF">Distrito Federal</Option>
                        <Option value="ES">Espírito Santo</Option>
                        <Option value="GO">Goiás</Option>
                        <Option value="MA">Maranhão</Option>
                        <Option value="MT">Mato Grosso</Option>
                        <Option value="MS">Mato Grosso do Sul</Option>
                        <Option value="MG">Minas Gerais</Option>
                        <Option value="PA">Pará</Option>
                        <Option value="PB">Paraíba</Option>
                        <Option value="PR">Paraná</Option>
                        <Option value="PE">Pernambuco</Option>
                        <Option value="PI">Piauí</Option>
                        <Option value="RJ">Rio de Janeiro</Option>
                        <Option value="RN">Rio Grande do Norte</Option>
                        <Option value="RS">Rio Grande do Sul</Option>
                        <Option value="RO">Rondônia</Option>
                        <Option value="RR">Roraima</Option>
                        <Option value="SC">Santa Catarina</Option>
                        <Option value="SP">São Paulo</Option>
                        <Option value="SE">Sergipe</Option>
                        <Option value="TO">Tocantins</Option>
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

export default Users