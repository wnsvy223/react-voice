import { useState } from "react";
import connection from '../lib/RTCMultiConnection';

const useConnection = () => {
    const [ speak, setSpeak ] = useState({});
    const [ messageList, setMessageList ] = useState([]);

    connection.onmessage = (event) => {
        switch(event.data.type){
            case 'speaking':
                setSpeak(event.data);
                break;
            case 'silence':
                setSpeak(event.data);
                break;
            case 'textMessage':
                setMessageList(message => [...message, event.data]); 
                break;
            default:
        } 
    };

    return { speak, messageList, setMessageList };
}

export default useConnection;