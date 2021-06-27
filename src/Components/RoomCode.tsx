import { useState } from 'react';
import copy from '../Assets/images/copy.svg';
import '../styles/room-code.scss';


type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){

    ///const [roomCode, setRoomCode] = useState('');

    function copyRoomCodeToClipyBoard(){

        //alert('aqui');
        //setRoomCode(props.code);
        navigator.clipboard.writeText(props.code);
        //return;
        //alert("cliked")
    }

    return(
        <button className="room-code" onClick={copyRoomCodeToClipyBoard}>
            <div>
                <img src={copy} alt="copy room code"/>
            </div>
            <span>sala {props.code}</span>

        </button>
    );
}