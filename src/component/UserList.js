import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import connection from '../lib/RTCMultiConnection';
import initHark from '../lib/Hark';

const useStyles = makeStyles((theme) => ({
  listItem: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  userList:{
    textAlign: 'center'
  },
  speak:{
    border: '3px solid red'
  },
  silence:{
    border: '0'
  },
  avatarDefault:{
    backgroundColor: green[500]
  }
}));

const UserList = () => {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);
  const [speak, setSpeak] = useState({
    userid: '',
    isSpeak: false
  });

  useEffect(() => {
    connection.onstream = (event) => {
      setParticipants(p => [...p, event]); // spread 연산자로 배열 요소 추가
      initHark({ // hark.js 초기화
        stream: event.stream,
        event: event,
        connection: connection,
      });
    };
    
    connection.onstreamended = (event) => {      
      setParticipants(p => p.filter(user => user.userid !== event.userid)); // filter 함수로 배열 요소 삭제
    };

    connection.onmessage = (event) => {
      switch(event.data.type){
          case 'speaking':
              setSpeak({
                userid: event.data.userid,
                isSpeak: true
              });
              break;
          case 'silence':
              setSpeak({
                userid: event.data.userid,
                isSpeak: false
              });
              break;
          default:
      } 
    };

    connection.onerror = (event) => {
      console.warn(`unable to open data connection between you and ${event.userid}`);
    };
  }, []);

  return (
    <List dense className={classes.userList}>
      {participants.length <= 0 && `대화 참가자가 없습니다.`}
      {participants.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user.userid}`;
        return (
          <ListItem key={user.userid} button>
            <ListItemAvatar>
              <Avatar
                className={clsx(classes.avatarDefault, (speak.isSpeak === true && speak.userid === user.userid) ? classes.speak : classes.silence)}
                alt={`${user.extra.userName}`}
                src={`${user.extra.userProfile}`}
              />
            </ListItemAvatar>
            <ListItemText id={labelId} primary={`${user.extra.userName}`} />
          </ListItem>
        );
      })}
    </List>
  );
}


export default UserList;
