import { UserOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Divider, Card } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Register: React.FC = () => {
    
    const [isLoading, setIsLoading] = useState(false);
    const handleRegister = () => {

    }

    return(
        <Row>
            <Col span={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <img src="img/login/background.svg" alt="Background Login" style={{width: '65%'}} />
                </div>
            </Col>
            <Col span={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%'}}>
                    <Card>
                        <Row gutter={15}>
                            <Col span={24}>
                                <img src="img/logo-colored.png" style={{width: 260}} alt=""/>
                                <Divider />
                                    
                                <Form
                                    name="normal_login" 
                                    layout="vertical"
                                    className="login-form" 
                                    onFinish={handleRegister}
                                    style={{width: '100%'}}
                                    initialValues={{email: 'michelhenrsilva@gmail.com', password: '123456'}}
                                >   
                                <Row gutter={15}>
                                    <Col span={12}>                                    
                                        <Form.Item
                                            label="Razão Social"
                                            name="name"
                                            rules={[
                                                { 
                                                    required: true,                             
                                                    message: 'Campo obrigatório!' 
                                                }
                                            ]}
                                        >
                                            <Input                                                
                                                size="large"
                                                placeholder="" 
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Nome Fantasia"
                                            name="fantasy_name"
                                            rules={[
                                                { 
                                                    required: true,                             
                                                    message: 'Campo obrigatório!' 
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder=""                                                
                                                size="large"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>                                        
                                        <Form.Item
                                            label="Telefone"
                                            name="phone"
                                            rules={[
                                                { 
                                                    required: true,                             
                                                    message: 'Campo obrigatório!' 
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="DDD + Número"                                                 
                                                size="large"
                                            />
                                        </Form.Item> 
                                    </Col>
                                    <Col span={8}>                                        
                                        <Form.Item
                                            label="CPF/CNPJ"
                                            name="document"
                                            rules={[
                                                { 
                                                    required: true,                             
                                                    message: 'Campo obrigatório!'
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="Somente números"                                                 
                                                size="large"
                                            />
                                        </Form.Item> 
                                    </Col>
                                    <Col span={8}>                                       
                                        <Form.Item
                                            label="E-mail"
                                            name="email"
                                            rules={[
                                                { 
                                                    required: true,                             
                                                    message: 'Campo obrigatório!' 
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="E-mail" 
                                                type="email" 
                                                size="large"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>                                        
                                        <Form.Item
                                            label="Senha"
                                            name="password"
                                            rules={[{ required: true, message: 'Informe a senha!' }]}
                                        >
                                            <Input
                                                type="password"
                                                size="large"
                                                placeholder="Senha"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>                                            
                                        <Form.Item
                                            label="Confirme a senha"
                                            name="password_confirmation"
                                            rules={[{ required: true, message: 'Confirme a senha!' }]}
                                        >
                                            <Input
                                                size="large"
                                                type="password"
                                                placeholder="Senha"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} style={{textAlign: 'right'}}>  
                                        <Button type="primary" style={{width: 150}} htmlType="submit" className="login-form-button" loading={isLoading}>
                                            Cadastre-se
                                        </Button> 
                                    </Col>
                                </Row>           
                                    <Form.Item>
                                        <br/>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <span>Já tem uma conta? </span>
                                            <NavLink to="login" className="login-form-forgot">
                                                Acesse aqui
                                            </NavLink>
                                        </Form.Item>
                                    </Form.Item> 
                                </Form> 
                            </Col>
                        </Row>
                    </Card> 
                </div>       
            </Col>                    
        </Row>
    )
}

export default Register;