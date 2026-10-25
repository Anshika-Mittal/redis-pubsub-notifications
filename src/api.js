import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.redisURL || 'redis://localhost:6379');

app.post("/notification", async (req, res)=>{
    const payload = {
        title: req.body.title || "Default title",
        createdAt: new Date().toISOString()
    }
    const receivers = await publisher.publish("notifications", JSON.stringify(payload));
    res.json({message: `Published on ${receivers}`});
})

app.listen(3000, ()=>{
    console.log("Server listening on http://localhost:3000");
})