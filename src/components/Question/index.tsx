import { ReactNode, useEffect, useState } from 'react';
import cn from 'classnames'

import './style.scss'

type QuestionProps = {
    children?: ReactNode;
    content: string;
    author: {
        nome: string;
        avatar: string
    };
    isAnswered?: boolean;
    isHighlighted?: boolean;
};

export function Question(props: QuestionProps) { 
    const [transitionState, setTransitionState] = useState(false)

    useEffect(() => {
        setTransitionState(true)
    }, [])

    return (
        <div 
            className={cn(
                'question', 
                {answered: props?.isAnswered ?? false},
                {highlighted: (props?.isHighlighted && !props?.isAnswered) ?? false},
                {hidden: !transitionState}
            )}
        >   
            <p>{props.content}</p>
            <footer>
                <div className="user-info">
                    <img src={props.author.avatar} alt={props.author.nome}/>
                    <span></span>
                </div>
                <div>
                    {props.children}
                </div>
            </footer>
        </div>
    )
}