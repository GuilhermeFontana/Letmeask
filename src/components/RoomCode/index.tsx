import toast from 'react-hot-toast'

import copyImg from '../../assets/images/copy.svg';

import './style.scss'


type RoomCodeProps = {
    code: string;
}


export function RoomCode(props: RoomCodeProps) { 

    function copyRoomCodeToClipboard () {
        navigator.clipboard.writeText(props.code)
        
        toast.success('Código copiado', {
            position: "bottom-right"
        })
    }
    
    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copiar código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}