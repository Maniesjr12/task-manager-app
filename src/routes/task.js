const express = require('express');
const { update } = require('../db/model/task');
const Task = require('../db/model/task');
const auth = require('../middleware/auth')

const app = express();

const router = express.Router();

router.post('/task', auth, async (req, res)=>{
    const task = new Task({ ...req.body, owner: req.user._id });
    
    try{
        await task.save();
        res.status(200).send(task)

    }catch(e){
        res.status(500).send(e)
    }
})


router.patch('/tasks/:id', auth, async (req, res)=>{
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const successfulUpdate = updates.every((update)=> allowedUpdates.includes(update))
    if(!successfulUpdate){
        return res.send({error: 'invalid update'})
    } 

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
            
        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();      
        res.status(200).send(task);

    }catch(e){
        res.status(400).send(e)
    }

})
// tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{
    const match = {};
    const sort = {};

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ?-1 : 1;
    }
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    try{  
        // const task = await Task.find({owner: req.user._id });
        await req.user.populate({
            path: 'tasks', match,
            options:{
                limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }
     }).execPopulate()
        
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res)=>{

    const _id = req.params.id;

    try{
        const task = await Task.findOne({ _id, owner: req.user._id}).populate('tasks')
        if(!task){
            return res.status(404).send();
        }
        res.status(200).send(task);

    }catch(e){
        res.status(400).send(e)
    }


})

router.delete('/tasks/:id', auth, async (req, res) =>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)

    }
} )


module.exports = router;