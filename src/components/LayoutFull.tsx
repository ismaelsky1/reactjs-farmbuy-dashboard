import {
    ExclamationCircleOutlined, MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Layout, Modal } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { useAuth } from '../contexts/auth';
import MenuLayout from './MenuLayout';

const LayoutFull: React.FC = ({children}) => {
    
    const { Header, Sider, Content } = Layout;
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const {doLogout} = useAuth();

    function handlerLogout() {
        Modal.confirm({
          icon: <ExclamationCircleOutlined />,
          title: 'Atenção',
          content: 'Deseja realmente finalizar sua sessão?',
          onOk() {doLogout()},
          onCancel() {Modal.destroyAll()},
          cancelText: 'Cancelar',
          okText: 'Sim, finalizar'
        });
    }

    return(
        <Layout>
            <Sider trigger={null} collapsible collapsed={menuCollapsed}>
                <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <img src="img/logo.png" style={{width: '70%', paddingTop: 15}} alt=""/>
                </div>
                <MenuLayout />
                <Button 
                    ghost
                    style={{margin: '0 5%', width: '90%', position: 'absolute', bottom: '20px'}} 
                    onClick={handlerLogout}
                >
                    Sair
                </Button>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    { menuCollapsed ? 
                        <MenuUnfoldOutlined className="trigger" onClick={() => setMenuCollapsed(!menuCollapsed)} /> 
                    : 
                        <MenuFoldOutlined className="trigger" onClick={() => setMenuCollapsed(!menuCollapsed)}/>
                    }
                </Header>
                <Content 
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                    }}
                >
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    FarmBuy ©2021 All rights reserveds.{' '}
                    <a href="https://farmbuy.com.br">Acesse o site</a>.
                </Footer>
            </Layout>
        </Layout>
    )
}

export default LayoutFull;