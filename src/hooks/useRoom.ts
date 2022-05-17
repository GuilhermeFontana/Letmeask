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


export function useRoom (roomId: string) { 
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

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
            
            setTitle(databaseRoom.title)
            setAuthor(databaseRoom.authorId)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }

    }, [roomId, user?.id])

    return {
        questions,
        title,
        author
    }
}