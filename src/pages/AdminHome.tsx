import { FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/Button";

import logoImg from "../assets/images/logo.svg";

import '../styles/adminHome.scss'
import { Card } from "../components/Card";


type FirebaseRooms = Record<string, {
  authorId: string,
  title: string,
  questions: object
}>

type RoomType = {
  roomCode: string,
  authorId: string,
  title: string,
  countQuestions: number
}

export function AdminHome() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');
  const [rooms, setRooms] = useState<RoomType[]>([])

  useEffect( () => {      
    const roomsRef = database.ref(`rooms`)     

    roomsRef.on('value', room => {
      const databaseRoom = room.val()

      const parsedRooms = Object.entries(databaseRoom as FirebaseRooms ?? {})
        .map(([key, value]) => {
          return {
            roomCode: key,
            authorId: value.authorId,
            title: value.title,
            countQuestions: Object.values(value.questions ?? {}).length
          }
        })
        .filter(r => r.authorId === user?.id);

      setRooms(parsedRooms)
    })
  }, [user?.id])

  async function handleCreateRoom(event: FormEvent) { 
    event.preventDefault();
    
    if (newRoom.trim() === '')
      return;
      
    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`)

  }
  
  return (
    <div id="page-home">
      <div className="rooms">
        <strong>Minhas salas</strong>
        <div  className="rooms-list">
          {rooms.map(room => {
              return <Card 
                roomCode={room.roomCode} 
                roomTitle={room.title}
                countQuestions={room.countQuestions} />
            }
          )}
        </div>
      </div>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              onChange={event => {setNewRoom(event.target.value)}}
              placeholder="Nome da sala" 
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}