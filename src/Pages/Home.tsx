
import illustrationImg from '../Assets/images/illustration.svg';
import logoImg from '../Assets/images/logo.svg';
import googleIconImg from  '../Assets/images/google-icon.svg';
import '../styles/auth.scss'
import { Button } from "../Components/Button";
import {useHistory} from 'react-router-dom';

import { useAuth } from "../Hooks/useAuth";
import { FormEvent, useEffect, useState } from 'react';
import { database , auth} from '../Services/firebase';

export function Home(){
    const history = useHistory();


    const [roomCode, setRoomCode] = useState('');
    const {singInWithGoogle,user} = useAuth();

    

    async function handleCreateRoom(){
        if(!user){
            await singInWithGoogle();
        }

        history.push('/rooms/new');
        //
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();
        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(roomRef.val().endedAt){
            alert("Essa sala foi encerrada por um administrador!");
            return;
        }
        
        if(!roomRef.exists()){
            alert("Room does not exist");
            return;
        }

        
        history.push(`/rooms/${roomCode}`);
        
    }



    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="illustração simbolizando perguntas e respostas"/>
                <strong>crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as duvidas de sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Let Me Ask"/>
                    <button onClick={()=>handleCreateRoom()} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google"/>
                        crie sua sala com o google
                    </button>
                    <div className="separator"> ou entre em uma sala </div>
                    <form onSubmit={handleJoinRoom}>
                        <input onChange={ event => setRoomCode(event.target.value)} value={roomCode} type="text" placeholder="digite o codigo da sala"/>
                        <Button type="submit"> entrar na sala </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}