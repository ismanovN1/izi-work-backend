import express from 'express'
import mongoose from 'mongoose'
import config from 'config'
import helmet from 'helmet';
import router from './app/routes/index.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';


const PORT = process.env.PORT || 5000;


if (!config.get('jwt_private_key')) {
    console.error('FATAL ERROR: environment variable jwt_private_key is not defined.');
    process.exit(1);
  }

const app = express()

app.use(express.json())
app.use(fileUpload({parseNested:true}))
app.use(cors())
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(express.static('public'))

app.use('/api', router)


async function startApp() {
    try {
        await mongoose.connect(config.get('db_url'), {useUnifiedTopology: true, useNewUrlParser: true})
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()