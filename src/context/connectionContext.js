import React, { createContext } from 'react';
import useConnection from '../hooks/useConnection';
import useStream from '../hooks/useStream';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({children}) => {
    const { speak, messageList, setMessageList } = useConnection(); // 대화상태및 채팅메시지 상태변화를 위한 커스텀 훅
    const { participants } = useStream(); // 대화참가자 상태변화를 위한 커스텀 훅
    return (
        <ConnectionContext.Provider value={{speak, messageList, participants, setMessageList}}>   
                {children}
        </ConnectionContext.Provider>
    );
}