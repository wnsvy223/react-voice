import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import { ConnectionContext } from '../context/connectionContext';

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
    backgroundColor: green[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "13px"
  },
}));

const UserList = () => {
  const classes = useStyles();
  const { speak, participants } = useContext(ConnectionContext); // 컨텍스에서 전역접근가능한 대화상태와 참가자 상태값 받아옴

  return (
    <List dense className={classes.userList}>
      {participants.length > 0 && participants.map((user) => {
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
