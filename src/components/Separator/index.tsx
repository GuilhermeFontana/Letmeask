import './style.scss'


type SeparatorProps = { 
    text?: string
}


export function Separator(props: SeparatorProps) { 
    return (
        <div className={`separator ${props.text ? ' with-text' : ''}`}>{props.text}</div>
    )
}