import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://react-ttaallkk.netlify.app/">
        TTAALLKK
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: blue[400],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: blue[400],
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button);

export default function SignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const [ email, setEmail ] = useState('');
  const [ pw, setPw ] = useState('');

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPwChange = (e) => {
    setPw(e.target.value);
  };

 
  const handleSignUp = () => {
    console.log(`회원가입 요청 : ${email} // ${pw} // ${process.env.REACT_APP_PROD_SERVER_URL}`);
    axios.post(process.env.REACT_APP_PROD_SERVER_URL + "/api/signUp",
      {
        email: email,
        password: pw,
        displayName:"<테스트맨>"
      },
      {
        headers:{
          'Content-type': 'application/json'
        }
      }
    )
    .then((response) => {
      if(response.status === 200){
        console.log('회원가입 응답 : ' + JSON.stringify(response));
        history.push({
          pathname: '/dashboard'
        });
      }
    })
    .catch((err) => {;
      console.log('회원가입 오류! :' + err);
    });
  }

  const handleSignIn = () => {
    console.log(`로그인 요청 : ${email} // ${pw} // ${process.env.REACT_APP_PROD_SERVER_URL}`);
    fetch(process.env.REACT_APP_PROD_SERVER_URL + "/api/login", {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        password: pw
      })
    })
    .then((res) => res.json())
    .then((response) => {
      if(response.status === 200){
        history.push({
          pathname: '/dashboard'
        });
        console.log('로그인 응답 : ' + JSON.stringify(response));
      }
    })
    .catch((err) => {
        console.log('로그인 오류 : ' + err);
    });
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            TTAALLKK
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onEmailChange} value={email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onPwChange} value={pw}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="로그인 유지"
            />
            <ColorButton
              type="button"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleSignIn}
            >
              로그인
            </ColorButton>
            <ColorButton
              type="button"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleSignUp}
            >
              회원가입
            </ColorButton>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  비밀번호 찾기
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"회원가입"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}