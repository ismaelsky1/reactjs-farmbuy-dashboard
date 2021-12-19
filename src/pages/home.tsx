import React, { useEffect, useState } from 'react';
import { Col, Layout, Row } from 'antd';
import {
    UserAddOutlined,
    ReadOutlined,
    DollarOutlined,
    AuditOutlined
} from '@ant-design/icons';
import { Skeleton, Card } from 'antd';  
import LayoutFull from '../components/LayoutFull';
import api from '../services/api';

const Home: React.FC = () => {
    const { Content } = Layout;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({})
    const { Meta } = Card;

    useEffect(() => {
    //     api.get('dashboard').then(response => {
            setLoading(false)
    //         setData(response.data)
    //     }).catch(error => {
    //         setLoading(false)
    //     })
    },[])

    return(
        <LayoutFull>
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                <Row gutter={15}>
                    <Col span={6}>
                        <Card style={{ width: '100%' }}>
                            <Skeleton loading={loading} avatar active>
                                <Meta 
                                    avatar={<ReadOutlined style={{ fontSize: '24px' }}/>}
                                    title={data.courses}
                                    description="Assinantes"                                    
                                />
                            </Skeleton>
                        </Card>
                    </Col>
                    <Col span={6}>                      
                        <Card style={{ width: '100%' }}>
                            <Skeleton loading={loading} avatar active>
                                <Meta 
                                    avatar={<UserAddOutlined style={{ fontSize: '24px' }}/>}
                                    title={data.students}
                                    description="Usuários"                                    
                                />
                            </Skeleton>
                        </Card>
                    </Col>
                    <Col span={6}>                      
                        <Card style={{ width: '100%' }}>
                            <Skeleton loading={loading} avatar active>
                                <Meta 
                                    avatar={<DollarOutlined style={{ fontSize: '24px' }}/>}
                                    title={data.subscriptions}
                                    description="Cotações"                                    
                                />
                            </Skeleton>
                        </Card>
                    </Col>
                    <Col span={6}>                      
                        <Card style={{ width: '100%' }}>
                            <Skeleton loading={loading} avatar active>
                                <Meta 
                                    avatar={<AuditOutlined style={{ fontSize: '24px' }}/>}
                                    title={data.certificates}
                                    description="Vendedores"                                    
                                />
                            </Skeleton>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </LayoutFull>
    )
}

export default Home;