import React, { useState, useEffect } from 'react';
import connection from './lib/RTCMultiConnection';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import { UserList } from './List';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      '&:hover': {
        backgroundColor: purple[700],
      },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      }
    },
    btn:{
        margin: theme.spacing(1)
    }
}));

const RoomForm = () => {
    const classes = useStyles();

    const [input, setInput] = useState({
        userName: '',
        roomName: '',
        password: ''
    });
    const {userName, roomName, password} = input;
    
    useEffect(() => {
        //console.log('렌더링이 완료되었습니다!');
        //console.log(name + " + " + roomName + " + " + password);
    },[userName, roomName, password]);

    const onChange = e => {
        const {name, value} = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    }

    const openRoom = () => {
        console.log('방만들기' + userName + ' / ' + roomName);
        if(userName.length <= 0){
            alert('닉네임을 입력하세요');
        }else if(roomName.length <= 0){
            alert('방제목을 입력하세요');
        }else if(password.length <= 0){
            alert('비밀번호를 입력하세요');
        }else{
            connection.password = password;
            connection.publicRoomIdentifier = roomName;
            connection.checkPresence(roomName, (isRoomExist, roomid) => {
                if(isRoomExist === true) {
                    alert('해당 이름의 방이 이미 존재합니다.');
                    console.error('해당 이름의 방이 이미 존재합니다.');
                }else{
                    connection.open(roomName, (isRoomOpened, roomid, error) => {
                        if(isRoomOpened && !error){
                            console.log(`방생성 완료 : ${roomid}`);
                            connection.extra = {
                                uid: userName
                            };
                        }else{
                            console.error('방 생성 오류 :' + error);
                        }   
                    });
                }
            });
            setInput({
                userName: '',
                roomName: '',
                password: ''
            })
        }
    }
  
    const joinRoom = () => {
        console.log('방참가'  + userName + ' / ' + roomName);
        if(userName.length <= 0){
            alert('닉네임을 입력하세요');
        }else if(roomName.length <= 0){
            alert('방제목을 입력하세요');
        }else if(password.length <= 0){
            alert('비밀번호를 입력하세요');
        }else{
            connection.checkPresence(roomName, (isRoomExist, roomid, extra) => {
                if(isRoomExist === true) {
                    connection.password = password;
                    connection.join(roomName, (isRoomJoined, roomid, error) =>{
                        if(error){
                            switch(error){
                                case 'Room not available':
                                    alert('사용할 수 없는 방입니다.');
                                    break;
                                case 'Room full':
                                    alert('인원수가 초과되었습니다.');
                                    break;
                                case 'Invalid password':
                                    alert('비밀번호가 틀렸습니다.');
                                    break;
                                default:
                            }
                        }else{
                            console.log(`참가성공 : ${roomid}`);
                            connection.extra = {
                                uid: userName
                            };
                        }
                    });
                }else{
                    console.log('존재하지 않는 방이름 입니다.');
                }
            });
            setInput({
                userName: '',
                roomName: '',
                password: ''
            })
        }
    }

    const closeRoom = () => {
        connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
        connection.closeSocket(); 
        // 소켓 닫음(소켓에 연결된 유저가 없을 경우 방 사라짐. 소켓에 연결된 유저 한명이라도 있을 경우 방 재접속 가능).
        connection.attachStreams.forEach(function(stream) {
            stream.stop(); // 미디어 스트림 제거
        });
        connection.getAllParticipants().forEach(function(pid) {
            connection.disconnectWith(pid);
        });
    }

    return (
      <div>
        <form className={classes.root} noValidate autoComplete="off">
            <TextField name="userName" label="사용자 이름" variant="outlined" value={userName} onChange={onChange} />
            <TextField name="roomName" label="방제목" variant="outlined" value={roomName} onChange={onChange} />
            <TextField name="password" label="비밀번호" variant="outlined" value={password} onChange={onChange} />
        </form>
        <div>
            <ColorButton className={classes.btn} variant="contained" color="primary" onClick={openRoom}>방만들기</ColorButton>
            <ColorButton className={classes.btn} variant="contained" color="primary" onClick={joinRoom}>방참가</ColorButton>
            <ColorButton className={classes.btn} variant="contained" color="primary" onClick={closeRoom}>종료</ColorButton>
        </div>
      </div>
    );
};


export default RoomForm;