import React from "react"
import { Redirect, Route } from "react-router-dom"
import { getCurrentUser } from "../functions/getCurrentUser"

const ProtectedRoute = ({ component: Component, roles, path, ...rest }: any) => {       
    return (
		<Route path={path} {...rest} render={(props: any) => {
            const currentUser = getCurrentUser()
            let hasPermission = false
            if(currentUser){
                if(roles){
                    roles.forEach((item: string) => {

                        if(currentUser.profile.includes(item))
                            hasPermission = true
                        
                    });
                    if(hasPermission){
                        return <Component {...props} />                            
                    }else{
                        return <Redirect to="/unauthorized"/>
                    }
                }else{
                    return <Component {...props} />
                }
            }else{
                return <Redirect to="/login"/>
            }
        }}/>
	)
}

export default ProtectedRoute