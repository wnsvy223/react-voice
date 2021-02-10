import hark from 'hark';

const initHark = (args) => {
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
  
    speechEvents.on('stopped_speaking', () => {
        connection.send({
            userid : event.userid,
            type : "silence"
        });
    });
}

export default initHark;