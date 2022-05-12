import { useHistory, useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
// import { useAuth } from '../hooks/useAuth'

import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import toast, { Toaster } from 'react-hot-toast'

import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'


type RoomParams = {
    id: string;
}


export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory();
    const { id: roomId } = useParams<RoomParams>();
    const {questions, title} = useRoom(roomId);
    
    
    //#region EndRoom
    async function executeEndRoom() {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomId}`).update({
                endedAt: new Date()
            })
                .then(() => resolve(true))
                .catch((err) => reject(err)); 
        })
    }
    async function handleEndRoom() {
        await toast.promise(executeEndRoom(), {
            loading: 'Enecrrando...',
            success: <p>Sala encerrada</p>,
            error: <p>Erro ao encerrar a sala</p>,
          })

        history.push('/')
    }
    //#endregion EndRoom

    //#region CheckQuestionAsAnswered
    async function executeCheckQuestionAsAnswered(questionId: string){
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true
            })
                .then(() => resolve(true))
                .catch((err) => reject(err)); 
        })
    }
    async function handleCheckQuestionAsAnswered(questionId: string){
        await toast.promise(executeCheckQuestionAsAnswered(questionId), {
            loading: 'Marcando...',
            success: <p>Pergunta marcada como respondida</p>,
            error: <p>Erro ao marcar a pergunta como respondida</p>,
          })
    }
    //#endregion CheckQuestionAsAnswered

    //#region HighlightQuestion
    async function execureHighlightQuestion(questionId: string){
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: true
            })
                .then(() => resolve(true))
                .catch((err) => reject(err)); 
        })

    }
    async function handleHighlightQuestion(questionId: string){
        await toast.promise(execureHighlightQuestion(questionId), {
            loading: 'Destacando...',
            success: <p>Pergunta destacada</p>,
            error: <p>Erro ao destacar a pergunta</p>,
          })
    }
    //#endregion HighlightQuestion

    //#region DeleteQUestion
    async function executeDeleteQUestion(questionId: string) {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
                .then(() => resolve(true))
                .catch((err) => reject(err)); 
        })
    }
    async function handleDeleteQuestion (questionId: string) {
        toast.dismiss();

        toast((t) => (
            <div className="toast">
                <div className="texts">
                    <strong> Realmente deseja remover a pergunta?</strong>
                    <p />
                    <span>ou aguarde para cancelar</span>
                </div>
                <button 
                    onClick={async () => {
                        toast.dismiss();

                        await toast.promise(executeDeleteQUestion(questionId), {
                                loading: 'Removendo...',
                                success: <p>Pergunta Removida</p>,
                                error: <p>Erro ao remover a pergunta</p>,
                              })
                    }}
                    >
                    Sim
                </button>
            </div>
        ))
    }
    //#endregion DeleteQUestion

    
    return (
        <div id="page-room">  
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={ roomId } />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main >
                <div className="room-title">
                    <h1>{title}</h1>
                    <span>{questions.length} {questions.length === 1 ? 'pergunta': 'perguntas'}</span>
                </div>

                <div className="questions-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {(!question.isAnswered ?? false) && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Destacar pergunta"/>
                                        </button>
                                    </>
                                )}
                                <button
                                    className="remove-button"
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </Question>
                        )
                    }).reverse()}
                </div>

                <div>
                    <Toaster 
                        position="top-center"
                        reverseOrder={false}
                    />
                </div>
            </main>
        </div>
    )
}