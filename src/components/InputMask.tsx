import React, { InputHTMLAttributes, useCallback } from 'react'
import {cep, cpf, date} from './masks'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    mask: "CEP" | "CPF" | "DATE"
}

const InputMask: React.FC<InputProps> = ({ mask, ...props}) => {

    const handleKeyUp = useCallback( (e: React.FormEvent<HTMLInputElement>) => {

        switch(mask){
            case 'CEP':
                cep(e)
            break
            case 'CPF':
                cpf(e)
            break
            case 'DATE':
                date(e)
            break
        }
        
    }, [mask])

    return(
        <input type="text" className="ant-input" { ...props } onKeyUp={handleKeyUp} />
    )
}

export default InputMask