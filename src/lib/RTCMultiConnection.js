import RTCMultiConnection from 'rtcmulticonnection';
import hark from 'hark';

const connection = new RTCMultiConnection();

connection.socketURL = process.env.SIGNAL_SERVER_URL; // 시그널링 서버 URL

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
connection.iceServers.push({ // own viagenie turn server
    urls: 'turn:numb.viagenie.ca',
    username: 'wnsvy223@naver.com',
    credential: 'dlsvygud223@'
});

connection.onstream = function(event) {
    console.log(JSON.stringify(event));
    initHark({
        stream: event.stream,
        event: event,
        connection: connection,
    });
}

connection.onopen = (event) => {
    console.log(JSON.stringify(event));
};

connection.onmessage = (event) => {
    //console.log(JSON.stringify(event));
    switch(event.data.type){
        case 'speaking':
            //console.log(`스피크 ${event.data}`);
            break;
        case 'silence':
            //console.log(`사일런스 ${event.data}`);
            break;
        default:
    } 
};

function initHark(args){
    if(!window.hark){
        throw new Error('Please link hark.js');
    }

    var connection = args.connection;
    var event = args.event;
    var stream = args.stream;
    var options = {};
    var speechEvents = new hark(stream, options); // hark.js 초기화
    
    speechEvents.on('speaking', () => {
        connection.send({
            userid : event.userid,
            type : "speaking"
        });
    });

    speechEvents.on('stopped_speaking', () =>{
        connection.send({
            userid : event.userid,
            type : "silence"
        });
    });
}

export default connection;