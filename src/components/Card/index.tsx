import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './style.scss'

type CardProps = {
    roomCode: string
    roomTitle: string
    countQuestions: number;
}

export function Card (props: CardProps) {
    const history = useHistory()
    
    function adjustText(text: string){
        const wordsSplit = text.trim().split(' ')

        if (wordsSplit.length === 1)
            return text;

        let newText = '';
        let i = 0;
        wordsSplit.forEach(word => {
            if (word.length > 15 && (i === 0 || i === wordsSplit.length - 1))
                newText += `${word.substring(0, 15)} ${word.substring(15)} `;
            else
                newText += word + ' ';

            i ++;
        })
        return newText;
    }


    return (
        <div className={`card`}>
            <div  className={'card-title'}>
                <strong>{adjustText(props.roomTitle)}</strong>
            </div>
            <p>{props.countQuestions} perguntas</p>
            <div className="footer">
                <span>Entrar como:</span>
                <div className="buttons">
                    <button onClick={() => history.push(`/admin/rooms/${props.roomCode}`)}>Administrador</button>
                    <button onClick={() => history.push(`/rooms/${props.roomCode}`)}>Usuario</button>
                </div>
            </div>
        </div>
    )
}