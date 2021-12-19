import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'antd';
import menuList from '../constants/menu';

const MenuLayout: React.FC = () => {
    
    const { SubMenu } = Menu;

    return(
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['painel']} style={{marginTop: 12}}>
            {menuList.map( item => (
                <SubMenu key={item.key} title={item.name}>
                    {item.items.map((subItem: any) => (
                        <Menu.Item key={subItem.key}>
                            <NavLink to={subItem.url}>{subItem.name}</NavLink>
                        </Menu.Item>
                    ))}
                </SubMenu>
            ))}
        </Menu>
    )
}

export default MenuLayout