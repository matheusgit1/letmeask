import Logo from '../Assets/images/logo.svg';
import Logout from '../Assets/images/logout.svg';
import { Button } from '../Components/Button';
import { RoomCode } from '../Components/RoomCode';
import '../styles/room.scss';
import {useParams, useHistory} from 'react-router-dom';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { auth, database, firebase } from '../Services/firebase';
import { Questions } from '../Components/Questions';
import { useRoom } from '../Hooks/UseRoom';
import { StringDecoder } from 'string_decoder';
import React from 'react';
type RoomParams = {
    id: string;
}





export function Room(){
    //location.reload();
    const history = useHistory();
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    //const [newLike, setNewLike] = useState(0);

    console.log(user);

    const [newQuestion, setNewQuestion] = useState('');
    
    const {question, title} = useRoom(roomId);

  
    
    async function handleSendQuestion(event: FormEvent){

        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in aplication');
            
        }

        const Question = {
            content : newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
            //likeId: 
        }
        //console.log(newQuestion);

        await database.ref(`rooms/${roomId}/question`).push(Question);


        setNewQuestion('');
    }


    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {

        if(likeId){
            await database.ref(`rooms/${roomId}/question/${questionId}/likes/${likeId}`).remove();
        }
        else{
            await database.ref(`rooms/${roomId}/question/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }     
    }

    async function handleLogoutSession(){
        
        await auth.signOut();
        window.location.reload();

        //history.push('/');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img className="img-hover" onClick={()=>history.push('/')} src={Logo} alt="LetMeAsk"/>
                    <>
                        <RoomCode code={roomId}/>
                        <div onClick={()=>handleLogoutSession()} className="button-logout-container">
                            <svg aria-label="sair" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="purple" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                            
                            </svg>
                            <span>sair</span>
                        </div>
                    </>
                    
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>sala {title}</h1> <br/>
                   { question.length > 0 &&  <span>{question.length } perguntas</span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você quer perguntar" value={newQuestion} onChange={event=>setNewQuestion(event.target.value)}/>
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name}/>
                                <span>{user.name}</span>

                            </div>
                        ) : (
                            <span>para enviar uma pergunta, <button>faça seu login</button></span>
                        ) }
                        
                        <Button type="submit" disabled={!user}> Enviar Pergunta </Button>
                    </div>
                </form>
                <div className="question-list">
                    {
                        question.map(question => {
                            return (
                            <Questions isAnswered={question.isAnswered} isHighlighted={question.isHighlighted} key={question.id} content={question.content} author={question.author}>
                                {
                                    !question.isAnswered && (
                                        <>
                                            <button className={`like-button" ${question.likeId ? 'liked' : ''} `}
                                            type="button" aria-label="Marcar como gostei" onClick={()=>{handleLikeQuestion(question.id, question.likeId)}}>
                                                
                                                {question.likeCount > 0 && <span className="span-like">{question.likeCount}</span> }
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                            </button>
                                        </>
                                    )
                                }
                            </Questions>)
                        })
                    }
                </div>
                
                
            </main>
        </div>
    );
}