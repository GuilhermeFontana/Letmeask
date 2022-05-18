import { useHistory } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg'

import './style.scss'


export function Logo () {
    const { user } = useAuth();
    const history = useHistory()

    function handleGoToHomePage() { 
        if (user)
            history.push("/admin/rooms");
        else
            history.push("/");
    }

    return (
        <button 
            className="logo-buttom"
            type="button"
            onClick={handleGoToHomePage}
        >
            <div className="logo">
                <img src={logoImg} alt="Letmeask"/>
            </div>
        </button>
    )
}