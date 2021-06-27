import React, {useState, useEffect} from "react";
import {database, firebase} from '../Services/firebase'
import { useAuth } from "./useAuth";

type QuestionsType = {
    id: string;
    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
}


type FirebaseQuestion = Record<string, {

    author: {
        name: string;
        avatar:string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {authorId: string;}>;
}>

export function useRoom(roomId: string){
    const {user} = useAuth();
    const [question,setQuestion] = useState<QuestionsType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
    
        roomRef.on('value', room => {
          const databaseRoom = room.val();
          const firebaseQuestion: FirebaseQuestion = databaseRoom.question ?? {};
    
          const paramsQuestion = Object.entries(firebaseQuestion).map(([key , value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isAnswered: value.isAnswered,
              isHighlighted: value.isHighlighted,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
            }
          })
          setTitle(databaseRoom.title)
          setQuestion(paramsQuestion)
        })

        return () => {
          roomRef.off('value');
        } 

      }, [roomId, user?.id]) ;

      return {question, title};
 
}