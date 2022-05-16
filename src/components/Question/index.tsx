import { ReactNode, useEffect, useState } from 'react';
import cn from 'classnames'

import './style.scss'

type QuestionProps = {
    children?: ReactNode;
    footerChildren?: ReactNode;
    questionId: string;
    content: string;
    author: {
        nome: string;
        avatar: string
    };
    answer?: string;
    isHighlighted?: boolean;
    handleSendAnswer: Function;
};

export function Question(props: QuestionProps) {
    const [transitionState, setTransitionState] = useState(false)
    const [newAnswer, setNewAnswer] = useState(props.answer?.trim());

    useEffect(() => {
        setTimeout(function () {
            setTransitionState(true)}, 500
        )
    }, [])

    return (
        <div
            className={cn(
                'question',
                {highlighted: props?.isHighlighted ? true : false ?? false},
                {hidden: !transitionState}
            )}
        >
            <p>{props.content}</p>
            <div className="children">
                <div className="user-info">
                    <img src={props.author.avatar} alt={props.author.nome}/>
                    <span></span>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
            { <footer className={`answer ${!props?.answer ? 'hidden' : ''}`}>
                <form onSubmit={event => {props.handleSendAnswer(event, newAnswer, props.questionId)}}>
                    <textarea
                        placeholder="Resposta..."
                        disabled={props?.answer?.trim() ? true : false}
                        value={newAnswer}
                        onChange={event => setNewAnswer(event.target.value)}
                    />
                    {props?.footerChildren}
                </form>
            </footer> }
        </div>
    )
}