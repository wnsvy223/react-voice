import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MailIcon from "@material-ui/icons/Mail";
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
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
                <ListItem button key={text}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem button key={text}>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
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