import React from "react"

export function cep(e: React.FormEvent<HTMLInputElement>){
    e.currentTarget.maxLength = 9
    let value = e.currentTarget.value        
    value = value.replace(/\D/g, "")
    value = value.replace(/^(\d{5})(\d)/, "$1-$2")
    e.currentTarget.value = value
    return e.currentTarget.value
}

export function cpf(e: React.FormEvent<HTMLInputElement>){
    e.currentTarget.maxLength = 11
    let value = e.currentTarget.value        
    value = value.replace(/\D/g, "")
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
    e.currentTarget.value = value
    return e.currentTarget.value
}
export function date(e: React.FormEvent<HTMLInputElement>){
    e.currentTarget.maxLength = 8
    let value = e.currentTarget.value        
    value = value.replace(/\D/g, "")
    value = value.replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3")
    e.currentTarget.value = value
    return e.currentTarget.value 
}