import { useEffect, useState } from "react"

import { database } from '../services/firebase'
import { useAuth } from "./useAuth"


type FirebaseQuestions = Record<string, {
    author: {
        nome: string,
        avatar: string
    },
    content: string,
    isHighlighted: boolean,
    answer: string | undefined,
    likes: Record<string,{ 
        authorId: string
    }>
}>

type QuestionType = {
    id: string,
    author: {
        nome: string,
        avatar: string
    },
    content: string,
    isHighlighted: boolean,
    answer: string | undefined,
    likeCount: number,
    likeId: string | undefined
}


export function useRoom (roomCode: string) { 
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [endedAt, setEndedAt] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomCode}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()

            const parsedQuestions = 
                Object.entries(databaseRoom.questions as FirebaseQuestions ?? {})
                    .map(([key, value]) => {
                        return {
                            id: key,
                            content: value.content,
                            author: value.author,
                            isHighlighted: value.isHighlighted,
                            answer: value.answer,
                            likeCount: Object.values(value.likes ?? {}).length, 
                            likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                        }
                    });
            
            setAuthor(databaseRoom.authorId)
            setEndedAt(databaseRoom.endedAt)
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }

    }, [roomCode, user?.id])

    return {
        author,
        endedAt,
        questions,
        title,
    }
}