import googleIconImg from "../../assets/images/google-icon.svg";

import './style.scss'


type ButtonGoogleProps = { 
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}


export function ButtonGoogle(props: ButtonGoogleProps) {
  
  return (
    <button 
      className="btn-Google"
      onClick={props.onClick}
    >
      <img src={googleIconImg} alt="Logo do Google" />
      {props.text}
    </button>
  )
}
