import { useState } from "react";
import connection from '../lib/RTCMultiConnection';
import initHark from '../lib/Hark';

const useConnection = () => {
    const [ participants, setParticipants ] = useState([]);

    connection.onstream = (event) => {
        setParticipants(p => [...p, event]); // spread 연산자로 배열 요소 추가
        initHark({ // hark.js 초기화
            stream: event.stream,
            event: event,
            connection: connection,
        });
    };
    
    connection.onstreamended = (event) => {      
        setParticipants(p => p.filter(user => user.userid !== event.userid)); // filter 함수를 이용한 배열 요소 제거
    };

    connection.onleave = (event) => {
        setParticipants(p => p.filter(user => user.userid !== event.userid)); // filter 함수를 이용한 배열 요소 제거
    };

    return { participants };
}

export default useConnection;