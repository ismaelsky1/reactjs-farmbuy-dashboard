import React, { InputHTMLAttributes, useCallback } from 'react'

const InputMaskCPF: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({...props}) => {

    const handleKeyUp = useCallback( (e: React.FormEvent<HTMLInputElement>) => {

        e.currentTarget.maxLength = 11
        let value = e.currentTarget.value        
        value = value.replace(/\D/g, "")
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")

        e.currentTarget.value = value;

    }, [])

    return(
        <input className="ant-input" { ...props } onKeyUp={handleKeyUp} />
    )
}

export default InputMaskCPF