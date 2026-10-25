import Redis from 'ioredis';

const subscriber = new Redis(process.env.redisURL || 'redis://localhost:6379');

subscriber.subscribe('notifications', (err)=>{
    if (err){
        console.log("Error");
        return;
    }
    else{
        console.log("Subscribed");
    }
})

subscriber.on('message', (channel, message)=>{
    console.log("Recieved on ", channel, ":", JSON.parse(message));
})