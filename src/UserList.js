import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import connection from './lib/RTCMultiConnection';
import initHark from './lib/Hark';

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
  }
}));

const UserList = () => {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);
  const [speak, setSpeak] = useState(false);

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
      //console.log(JSON.stringify(event));
      switch(event.data.type){
          case 'speaking':
              //console.log(`스피크 ${JSON.stringify(event.data)}`);
              setSpeak(true);
              break;
          case 'silence':
              //console.log(`사일런스 ${JSON.stringify(event.data)}`);
              setSpeak(false);
              break;
          default:
      } 
    };

    connection.onerror = (event) => {
      console.warn(`unable to open data connection between you and ${event.userid}`);
    };
  }, []);

  if (participants.length <= 0) return <div className={classes.userList}>대화에 참가한 유저가 없습니다.</div>;

  return (
    <List dense className={classes.userList}>
      {participants.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user.userid}`;
        return (
          <ListItem key={user.userid} button>
            <ListItemAvatar>
              <Avatar
                className={speak ? classes.speak : classes.silence}
                alt={`Avatar n°${user.extra.userName}`}
                src={`/static/images/avatar/${user.extra.userName}.jpg`}
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
