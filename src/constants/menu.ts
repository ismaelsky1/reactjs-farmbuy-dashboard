import { getCurrentUser } from "../functions/getCurrentUser";

const user = getCurrentUser()
let menuList: any[] = []

if(user.profile.includes('ADMIN')){

    menuList.push(
        {
            key: 'management',
            name: 'Manutenção',
            items: [
                {
                    key: 'companies',
                    name: 'Assinantes',
                    url: '/companies'
                },
                {
                    key: 'users',
                    name: 'Usuários',
                    url: '/users'
                },
                {
                    key: 'plans',
                    name: 'Planos',
                    url: '/plans'
                },
                {
                    key: 'plans',
                    name: 'Produtos',
                    url: '/products'
                },
            ]
        },        
        {
            key: 'registers',
            name: 'Cadastros',
            items: [
                {
                    key: 'sellers',
                    name: 'Vendedores',
                    url: '/sellers'
                },
                {
                    key: 'quotations',
                    name: 'Cotações',
                    url: '/quotations'
                }
            ]
        },        
        {
            key: 'reports',
            name: 'Relatórios',
            items: [                
                {
                    key: 'invoices',
                    name: 'Faturas',
                    url: '/invoices'
                },
            ]
        }
    )
}

export default menuList;