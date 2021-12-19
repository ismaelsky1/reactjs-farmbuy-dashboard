import { Col, Row } from 'antd'
import React from 'react'
import LayoutFull from '../components/LayoutFull'
import {FrownTwoTone} from '@ant-design/icons'

const Unauthorized: React.FC = () => {
    
    return(
        <LayoutFull>
            <Row>
                <Col span={21} style={{textAlign: 'center', paddingTop: 100}}>
                    <FrownTwoTone style={{fontSize: 50}} twoToneColor="#eb2f96"/>
                    <h1 style={{fontSize: '22px'}}>Não autorizado</h1>
                    <p>Ops, desculpe! Você não tem acesso à esse conteúdo</p>
                </Col>
            </Row>
        </LayoutFull>
    )
}

export default Unauthorized