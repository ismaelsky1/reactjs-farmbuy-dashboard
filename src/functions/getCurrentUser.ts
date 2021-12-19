interface UserProps{
    profile: string;
}

export const getCurrentUser = (): UserProps => {
    const user:any = localStorage.getItem('@FarmBuy:user')
    if(user){
        return JSON.parse(user)
    }else{
        return {
            profile: ''
        }
    }
        
    
}