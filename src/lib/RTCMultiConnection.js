import RTCMultiConnection from 'rtcmulticonnection';

const connection = new RTCMultiConnection();

connection.socketURL = process.env.REACT_APP_SIGNAL_SERVER_URL; // 시그널링 서버 URL

// Set video directions and media types
connection.session = {
    video: false,
    audio: true,
    data: true
};

// Choose front or back camera, set resolutions, choose camera/microphone by device-id etc.
connection.mediaConstraints = {
    video: false,
    audio: {
        echoCancellation: true
    }
};

connection.optionalArgument = {};

connection.processSdp = function(sdp) {
    return sdp; // return unchanged SDP
};

connection.sdpConstraints = {
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
        IceRestart: true
    },
    optional: []
};
        
// set ice server (ignore default STUN+TURN servers)
connection.iceServers = [];

// stun server
connection.iceServers.push({
    urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
    ]
});

// turn server
connection.iceServers.push({
    urls: process.env.REACT_APP_TURN_SERVER_URL,
    username: process.env.REACT_APP_TURN_USERNAME,
    credential: process.env.REACT_APP_TURN_CREDENTIAL
});

export default connection;