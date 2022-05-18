import { useHistory, useParams } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react'

import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../hooks/useAuth'

import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { Logo } from '../components/Logo'
import toast, { Toaster } from 'react-hot-toast'

import starImg from '../assets/images/star.svg'
import answerImg from '../assets/images/answer.svg'
import deleteImg from '../assets/images/delete.svg'
import deleteAwnserImg from '../assets/images/delete-awnser.svg'

import '../styles/room.scss'


type RoomParams = {
    id: string;
}


export function AdminRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const { id: roomCode } = useParams<RoomParams>();
    const {questions, title, author, endedAt} = useRoom(roomCode);
    // eslint-disable-next-line
    const [answerVisibility, setAnswerVisibility] = useState(0)

    useEffect( () => {
        async function validateExistingPage() {
            const roomRef = await database.ref(`rooms/${roomCode}`).get();
        
            if (!roomRef.exists()) {
                history.push('/')
            }
        }
        validateExistingPage()

        if (author && user?.id !== author)
            history.push(`/rooms/${roomCode}`)

    // eslint-disable-next-line
    }, [user?.id, author])

    //#region CloseOpenRoom
    async function executeCloseRoom() {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomCode}`).update({
                endedAt: new Date()
            })
                .then(() => resolve(true))
                .catch((err) => reject(err));
        })
    }
    async function executeOpenRoom() {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomCode}`).update({
                endedAt: null
            })
                .then(() => resolve(true))
                .catch((err) => reject(err));
        })
    }
    async function handleCloseOpenRoom() {
        if (!endedAt){
            await toast.promise(executeCloseRoom(), {
                loading: 'Encerrando...',
                success: <p>Sala encerrada</p>,
                error: <p>Erro ao encerrar a sala</p>,
            })

            history.push('/admin/rooms')
        }
        else 
            await toast.promise(executeOpenRoom(), {
                loading: 'Reabrindo...',
                success: <p>Sala reaberta</p>,
                error: <p>Erro ao reabrir a sala</p>,
            })
    }
    //#endregion CloseOpenRoom

    //#region SendAnswer
    async function handleShowSendAnswer(questionId: string){
        questions.forEach(question => {
            if (question.id === questionId)
                question.answer = ' '
        })

        setAnswerVisibility(Math.random())
    }
    async function executeSandAnswer(event: FormEvent, newAnswer: string, questionId: string) {
        event.preventDefault();

        await database.ref(`rooms/${roomCode}/questions/${questionId}`).update({
            answer: newAnswer?.trim()
        })
    }
    async function handleSendAnswer(event: FormEvent, newAnswer: string, questionId: string) {
        event.preventDefault();

        await toast.promise(executeSandAnswer(event, newAnswer, questionId), {
            loading: 'Marcando...',
            success: <p>Pergunta marcada como respondida</p>,
            error: <p>Erro ao marcar a pergunta como respondida</p>,
          })
    }
    //#endregion SendAnswer

    //#region HighlightQuestion
    async function execureHighlightQuestion(questionId: string, isHighlighted: boolean){
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomCode}/questions/${questionId}`).update({
                isHighlighted: !isHighlighted
            })
                .then(() => resolve(true))
                .catch((err) => reject(err));
        })

    }
    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean){
        const succesMessage = isHighlighted ? "Destaque removido" : "Pergunta destacada";
        const errorMessage = isHighlighted ? "Erro ao remover destaque da pergunta" : "Erro ao destacar a pergunta";

        await toast.promise(execureHighlightQuestion(questionId, isHighlighted), {
            loading: 'Destacando...',
            success: <p>{succesMessage}</p>,
            error: <p>{errorMessage}</p>,
          }, {
              position: "bottom-right"
          })
    }
    //#endregion HighlightQuestion

    //#region DeleteQUestion
    async function executeDeleteQUestion(questionId: string) {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomCode}/questions/${questionId}`).remove()
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

    //#region DeleteAnswer
    async function executeDeleteAnswer(questionId: string) {
        return await new Promise(async function(resolve, reject) {
            await database.ref(`rooms/${roomCode}/questions/${questionId}`).update({
                answer: ''
            })
                .then(() => resolve(true))
                .catch((err) => reject(err));
        })
    }
    async function handleDeleteAnswer (questionId: string) {
        toast.dismiss();

        toast((t) => (
            <div className="toast">
                <div className="texts">
                    <strong> Realmente deseja remover a resposta?</strong>
                    <p />
                    <span>ou aguarde para cancelar</span>
                </div>
                <button
                    onClick={async () => {
                        toast.dismiss();

                        await toast.promise(executeDeleteAnswer(questionId), {
                                loading: 'Removendo...',
                                success: <p>Resposta Removida</p>,
                                error: <p>Erro ao remover a resposta</p>,
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
                    <Logo />
                    <div>
                        <RoomCode code={ roomCode } />
                        <Button isOutlined onClick={handleCloseOpenRoom}>{`${!!endedAt ? 'Reabrir' : 'Encerrar'} Sala`}</Button>
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
                                questionId={question.id}
                                content={question.content}
                                author={question.author}
                                answer={question.answer}
                                isHighlighted={question.isHighlighted}
                                handleSendAnswer={handleSendAnswer}
                                footerChildren={
                                    !question.answer?.trim() &&
                                        <div className="send-awnser-action">
                                            <Button type="submit">Enviar</Button>
                                        </div>
                                }
                            >
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                    >
                                        <img src={starImg} alt="Destacar pergunta"/>
                                    </button>
                                    {(!question?.answer ?  (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleShowSendAnswer(question.id)}
                                            >
                                                <img src={answerImg} alt="Marcar pergunta como respondida"/>
                                            </button>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAnswer(question.id)}
                                            >
                                                    <img src={deleteAwnserImg} alt="Remover resposta"/>
                                            </button>
                                        </>
                                    )
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta"/>
                                    </button>
                                </div>

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