import React, { InputHTMLAttributes, useCallback } from 'react'

const InputMaskDate: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({...props}) => {

    const handleKeyUp = useCallback( (e: React.FormEvent<HTMLInputElement>) => {

        e.currentTarget.maxLength = 11
        let value = e.currentTarget.value        
        value = value.replace(/\D/g, "")
        value = value.replace(/^(\d{2})(\d{2})(\d{4})/, "$1/$2/$3")

        e.currentTarget.value = '04/11/1991';

    }, [])

    return(
        <input type="text" className="ant-input" { ...props } onKeyUp={handleKeyUp} />
    )
}

export default InputMaskDate