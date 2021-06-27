import Logo from '../Assets/images/logo.svg';
import checkImg from '../Assets/images/check.svg';
import deleteImg from '../Assets/images/delete.svg';
import answer from '../Assets/images/answer.svg';
import { Button } from '../Components/Button';
import { RoomCode } from '../Components/RoomCode';
import '../styles/room.scss';
import {useParams, useHistory} from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { database, firebase } from '../Services/firebase';
import { Questions } from '../Components/Questions';
import { useRoom } from '../Hooks/UseRoom';

import { func } from 'prop-types';
import { Room } from './Room';
type RoomParams = {
    id: string;
}





export function AdminRoom(){

    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [newQuestion, setNewQuestion] = useState('');
    const history = useHistory();
    const {question, title} = useRoom(roomId)
    
    async function handleSendQuestion(event: FormEvent){

        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in aplication');
            
        }

        const question = {
            content : newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        }
        //console.log(newQuestion);

        await database.ref(`rooms/${roomId}/question`).push(question);


        setNewQuestion('');
    }

    async function handleEndRoom(RoomId: string) {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        console.log(questionId);
        if(window.confirm("você tem certeza que deseja excluir essa perguta?")){
            const questionRef = await database.ref(`rooms/${roomId}/question/${questionId}`).remove();
        }
    }

    async function  handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/question/${questionId}`).update({
            //isHighlighted: false,
            isAnswered: true,
        })
    }

    async function  handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/question/${questionId}`).update({
            isHighlighted: true,
            //isAnswered: true,
        })
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={Logo} alt="LetMeAsk"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button onClick={()=>handleEndRoom(roomId)}  isOutline >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>sala {title}</h1> <br/>
                   { question.length > 0 &&  <span>{question.length } perguntas</span>}
                </div>
                
                <div className="question-list">
                    {
                        question.map(question => {
                            return (
                                <Questions isAnswered={question.isAnswered} isHighlighted={question.isHighlighted} key={question.id} content={question.content} author={question.author}>
                                    {!question.isAnswered && (
                                       <>
                                            <button type="button" onClick={()=>handleCheckQuestionAsAnswered(question.id)}>
                                                <img src={checkImg} alt="marcar pergunta como respondida"/>
                                            </button>
                                            <button type="button" onClick={()=>handleHighlightQuestion(question.id)}>
                                                <img src={answer} alt="ddar destaque a pergunta"/>
                                            </button>
                                       </>
                                    )}
                                    <button type="button" onClick={()=>handleDeleteQuestion(question.id)}>
                                        <img src={deleteImg} alt="deletar pergunta"/>
                                    </button>
                                </Questions>
                            )
                        })               
                    }                  
                </div>            
            </main>
        </div>
    );
}