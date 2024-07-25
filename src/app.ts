import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use('/',()=>console.log("running")
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
