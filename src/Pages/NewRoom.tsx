import React, { FormEvent, useState} from "react";
import illustrationImg from '../Assets/images/illustration.svg';
import logoImg from '../Assets/images/logo.svg';
import {useHistory} from 'react-router-dom'
import '../styles/auth.scss'
import { Button } from "../Components/Button";
import {Link} from 'react-router-dom'
import { database } from "../Services/firebase";
import { useAuth } from "../Hooks/useAuth";


export function NewRoom(){
    const history = useHistory();
    const {user} = useAuth();
    
    const [newRoom, setNewRoom ] = useState('');

    async function handleCreateRoom(event: FormEvent){
        //alert('aqui')
        event.preventDefault();
        if(newRoom.trim() === ''){
            //alert('aqui');
            return;

        }

        const roomRef =  await database.ref('rooms')
        const firebaseRoom = roomRef.push({
            title: newRoom,
            authorId: user?.id,     
        })

        history.push(`/rooms/${firebaseRoom.key}`)
        //console.log(newRoom);
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder="nome da sala" value={newRoom} onChange={ event =>setNewRoom(event.target.value)}/>
                        <Button type="submit"> Criar sala </Button>
                    </form>
                    <p>quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}