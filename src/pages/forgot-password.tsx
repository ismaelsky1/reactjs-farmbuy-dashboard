import { UserOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Divider, Card } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
 
    return(
        <Row>
            <Col span={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <img src="img/login/background.svg" alt="login" style={{width: '50%'}}/>
                </div>
            </Col>
            <Col span={12}>                
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <Card>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <img src="img/logo-black.png" style={{width: 150}} alt=""/>
                                <p style={{textAlign: 'left', width: 240}}>
                                    Preecha o email abaixo para receber o link de recuperação
                                </p>
                                <Divider />
                                
                                <Form
                                    name="normal_login" 
                                    layout="vertical"
                                    className="login-form" 
                                    onFinish={() => {}}
                                >                    
                                    <Form.Item
                                        label="E-mail"
                                        name="email"
                                        rules={[
                                            { 
                                                required: true,                             
                                                message: 'Informe seu email!' 
                                            }
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <span>Faça login </span>
                                        </Form.Item>
                                        <NavLink to="/" className="login-form-forgot" >
                                            aqui
                                        </NavLink>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" block htmlType="submit" className="login-form-button">
                                            Enviar
                                        </Button>
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

export default ForgotPassword;