import React , {ButtonHTMLAttributes} from 'react';
import '../styles/buttons.scss';


type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutline?: boolean;
}


export function Button ({isOutline = false, ...props}: buttonProps){
    
    return(
        <button className={`button ${isOutline ? 'outlined' : ''}`} {...props}/>
    );
}

