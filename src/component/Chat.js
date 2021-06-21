import React, { useState, useContext }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SendIcon from '@material-ui/icons/Send';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { ConnectionContext } from '../context/connectionContext';
import connection from '../lib/RTCMultiConnection';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  },
  messageAvatar:{
    backgroundColor: green[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: "13px"
  },
  myMessage:{
    flexDirection: "column",
    alignItems: "flex-end",
  },
  participantsMessage:{
    flexDirection: "column",
    alignItems: "flex-start",
  }
}));

const Chat = () => {
    const classes = useStyles();
    const [ text, setText ] = useState('');
    const { participants, messageList, setMessageList } = useContext(ConnectionContext); // 컨텍스에서 전역접근가능한 채팅메시지와 참가자 상태값 받아옴

    const onChange = (e) => {
        setText(e.target.value);
    };

    const handleSendMessage = () => {
        const myMsg = {
            type: 'textMessage',
            text: text,
            userid: connection.userid,
            userName: connection.extra.userName,
            userProfile: connection.extra.userProfile
        }
        setMessageList(chat => [...chat, myMsg]); 
        connection.send(myMsg);
        setText('');
    }

    return (
        <div>
            <Grid item xs={12}>
                <List className={classes.messageArea}>
                {
                    participants.length > 0 && messageList.map((data, index) => { 
                        return (
                            <ListItem  key={index} className={(data.userid === connection.userid) ? classes.myMessage : classes.participantsMessage}>
                                { 
                                    data.userid === connection.userid 
                                    ? 
                                    null
                                    : 
                                    <ListItemAvatar>
                                        {
                                            data.userProfile !== null
                                            ?
                                            <Avatar className={classes.messageAvatar} src='/' alt={data.userName}/>
                                            :
                                            <Avatar className={classes.messageAvatar} src={data.userProfile}/>
                                        }
                                    </ListItemAvatar> 
                                }
                                <ListItemText primary={data.text} secondary={moment().format('YYYY-MM-DD HH:mm:ss')} />
                            </ListItem>
                        );
                    })
                }
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email" label="Type Something" fullWidth onChange={onChange} value={text} />
                    </Grid>
                    <Grid item xs={1} align="right">
                        <IconButton color="primary" aria-label="upload picture" onClick={handleSendMessage} component="span">
                            <SendIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;