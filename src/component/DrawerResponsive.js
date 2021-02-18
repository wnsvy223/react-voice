import React, { useState, useEffect } from "react";
import { makeStyles, withStyles, createStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FolderIcon from '@material-ui/icons/Folder';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import { blue } from '@material-ui/core/colors';
import RoomForm from './RoomForm';
import UserList from './UserList';

const drawerWidth = 300;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
        display: "flex",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: blue[500]
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawer: {
        flexShrink: 0,
    },
    drawerHide: {
        width: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        //background: "linear-gradient(45deg, #0396FF 30%, #0396FF 90%)",
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        width: drawerWidth,
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
  })
);

const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
      },
    }
}))(Badge);

function ResponsiveDrawer() {
    const classes = useStyles();
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [isSidebarOpen, setSidebarOpen] = useState(!smallScreen);

    useEffect(() => {
        setSidebarOpen(!smallScreen);
    }, [smallScreen]);

    function handleToggleSidebar(open) {
        setSidebarOpen(open);
    }

    return (
        <div className={classes.root}>
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: isSidebarOpen,
            })}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => handleToggleSidebar(true)}
                edge="start"
                className={clsx(classes.menuButton, isSidebarOpen && classes.hide)}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                TTAALLKK
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            className={clsx(classes.drawer, {
            [classes.drawerHide]: !isSidebarOpen,
            })}
            variant="persistent"
            anchor="left"
            open={isSidebarOpen}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
            <ListItem>
                <ListItemAvatar>
                    <StyledBadge
                        overlap="circle"
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                        }}
                        variant="dot">
                        <Avatar className={clsx(classes.avatarDefault)}  alt="프로필" src="/" />
                    </StyledBadge>
                </ListItemAvatar>
                <ListItemText primary="아이디" secondary="정보" />
            </ListItem>
            <IconButton onClick={() => handleToggleSidebar(false)}>
                {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
                ) : (
                <ChevronRightIcon />
                )}
            </IconButton>
            </div>
            <Divider />
            <List>
            {["메뉴1", "메뉴2", "메뉴3"].map((text, index) => (
                <ListItem button key={text}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
            <Divider />
            <UserList></UserList>
        </Drawer>
        <main
            className={clsx(classes.content, {
            [classes.contentShift]: isSidebarOpen && !smallScreen,
            })}
        >
            <div className={classes.drawerHeader} />
            <RoomForm></RoomForm>
        </main>
        </div>
    );
}

export default ResponsiveDrawer;