import { useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { ButtonGoogle } from "../components/ButtonGoogle";
import { Separator } from "../components/Separator";
import toast, { Toaster } from 'react-hot-toast'

import '../styles/home.scss'
import { FormEvent, useState } from 'react';


export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() { 
    if (!user)
      await signInWithGoogle();    

    history.push("/admin/rooms");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '')
      return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    
    if (!roomRef.exists()) {
      toast.error('Sala não encontrada')
      return;
    }

    if (roomRef.val().endedAt){
      toast.error('Sala já encerrada')
      return;
    }
    
    history.push(`/rooms/${roomCode}`)
  }
  
  return (
    <div id="page-home">
      <aside>
        <img src={illustrationImg} alt=" " />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <ButtonGoogle 
            text="Entre com o Google e crie suas salas"
            onClick={handleCreateRoom}
          />
          <Separator text="ou entre em uma sala"/>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>

        <div>
            <Toaster 
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
      </main>
    </div>
  );
}