import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { blue } from '@material-ui/core/colors';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import connection from '../lib/RTCMultiConnection';

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(blue[500]),
      backgroundColor: blue[500],
      '&:hover': {
        backgroundColor: blue[700],
      },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    inputForm: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      }
    },
    center:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn:{
        margin: theme.spacing(1)
    }
}));

const RoomForm = () => {
    const classes = useStyles();

    const [isOnAir, setIsOnAir] = useState(false);
    const [input, setInput] = useState({
        userName: '',
        roomName: '',
        password: '',
        showPassword: false,
    });
    const {userName, roomName, password, showPassword} = input; // Object Destructuring(객체의 요소값들을 키값으로 접근가능)
    
    const onChange = e => {
        const {name, value} = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    }

    const handlePasswordChange = (prop) => (event) => {
        setInput({ ...input, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setInput({ ...input, showPassword: !showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const openRoom = () => {
        if(!userName){
            alert('닉네임을 입력하세요');
        }else if(!roomName){
            alert('방제목을 입력하세요');
        }else if(!password){
            alert('비밀번호를 입력하세요');
        }else{
            connection.password = password;
            connection.publicRoomIdentifier = roomName;
            connection.extra.userName = userName;
            connection.checkPresence(roomName, (isRoomExist, roomid) => {
                if(isRoomExist === true) {
                    alert('해당 이름의 방이 이미 존재합니다.');
                    console.error('해당 이름의 방이 이미 존재합니다.');
                }else{
                    connection.open(roomName, (isRoomOpened, roomid, error) => {
                        if(isRoomOpened && !error){
                            setIsOnAir(true);
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
            });
        }
    }
  
    const joinRoom = () => {
        if(!userName){
            alert('닉네임을 입력하세요');
        }else if(!roomName){
            alert('방제목을 입력하세요');
        }else if(!password){
            alert('비밀번호를 입력하세요');
        }else{
            connection.extra.userName = userName;
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
                            setIsOnAir(true);
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
            });
        }
    }

    const closeRoom = () => {
        connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
        connection.closeSocket(); 
        // 소켓 닫음(소켓에 연결된 유저가 없을 경우 방 사라짐. 소켓에 연결된 유저 한명이라도 있을 경우 방 재접속 가능).
        connection.attachStreams.forEach((stream) => {
            stream.stop(); // 미디어 스트림 제거
        });
        connection.getAllParticipants().forEach((pid) => {
            connection.disconnectWith(pid);
        });
        setIsOnAir(false);
    }

    return (
      <div>
        {!isOnAir && 
            <form className={clsx(classes.inputForm, classes.center)} noValidate autoComplete="off">
                <TextField name="userName" label="닉네임" size="small" variant="outlined" value={userName} onChange={onChange} />
                <TextField name="roomName" label="방제목" size="small" variant="outlined" value={roomName} onChange={onChange} />
                <FormControl className={clsx(classes.margin, classes.textField)} size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange('password')}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                        labelWidth={70}
                    />
                </FormControl>
            </form>
        }
        <div className={classes.center}>
            {!isOnAir && <ColorButton className={classes.btn} variant="contained" color="primary" onClick={openRoom}>방만들기</ColorButton>}
            {!isOnAir && <ColorButton className={classes.btn} variant="contained" color="primary" onClick={joinRoom}>방참가</ColorButton>}
            {isOnAir && <ColorButton className={classes.btn} variant="contained" color="primary" onClick={closeRoom}>종료</ColorButton>}     
        </div>
      </div>
    );
};


export default RoomForm;