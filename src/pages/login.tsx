import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Divider, Card, Alert } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/auth';


const Login: React.FC = () => {

    const context = useAuth();
    
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState([])

    async function handleLogin(values: any){
        setIsLoading(true)
        try{
            
            await context.doLogin(values)
            setIsLoading(false)

        }catch(error: any){
            setErrors(JSON.parse(error.message))
            setIsLoading(false)
        }
    }

    return(
        <Row>
            <Col span={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <img src="img/login/background.svg" alt="Background Login" style={{width: '65%'}} />
                </div>
            </Col>
            <Col span={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                    <Card>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <img src="img/logo-colored.png" style={{width: 260}} alt=""/>
                                <Divider />
                                    
                                <Form
                                    name="normal_login" 
                                    layout="vertical"
                                    className="login-form" 
                                    onFinish={handleLogin}
                                    style={{width: 340}}
                                    initialValues={{email: 'apps@farmbuy.com.br', password: 'zxc102030'}}
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
                                    <Form.Item
                                        label="Senha"
                                        name="password"
                                        rules={[{ required: true, message: 'Informe sua senha!' }]}
                                    >
                                        <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Senha"
                                        />
                                    </Form.Item>
                                    <Form.Item>                                        
                                        <ul style={{listStyle: 'none'}}>
                                            {errors.map((item: any) => (                        
                                                <li>
                                                    <Alert message={item?.message} type="error" style={{marginTop: 10}}/>                            
                                                </li>                        
                                            ))}
                                        </ul>
                                        <br/>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <span>Esqueceu a senha? </span>
                                            <NavLink to="forgetpassword" className="login-form-forgot">
                                                Recupere aqui
                                            </NavLink>
                                        </Form.Item>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" block htmlType="submit" className="login-form-button" loading={isLoading}>
                                            Entrar
                                        </Button>
                                    </Form.Item>  
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <span>Ainda não tem uma conta? </span>                                            
                                        <NavLink to="register" className="login-form-forgot">
                                            Cadastre-se aqui
                                        </NavLink>
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

export default Login;