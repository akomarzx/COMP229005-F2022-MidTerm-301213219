// create a reference to the model
let TodoModel = require('../models/todo');
let mongoose = require('mongoose');
// Gets all todo from the Database and renders the page to list them all.
module.exports.todoList = function(req, res, next) {  

    TodoModel.find((err, todoList) => {
        //console.log(todoList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('todo/list', {
                title: 'To-Do List', 
                TodoList: todoList,
                userName: req.user ? req.user.username : ''
            })            
        }
    });
}


// Gets a todo by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;

    TodoModel.findById(id, (err, todoToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('todo/details', {
                title: 'To-Do Details', 
                todo: todoToShow
            })
        }
    });
}

// Gets a todo by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = async (req, res, next) => {
    try {
        let todoToBeUpdated = await TodoModel.findOne({_id : req.params.id}).exec();
        res.locals.title = 'Editing Todo';
        res.locals.todo = todoToBeUpdated;
        res.status(200).render('todo/add_edit')
    } catch (error) {
        console.log(error);
        res.end(error);
    }
}

// Processes the data submitted from the Edit form to update a todo
module.exports.processEditPage = async (req, res, next) => {

    let id = req.params.id
    
    console.log(req.body);

    let updatedTodo = TodoModel({
        _id: req.body.id,
        task: req.body.task,
        description: req.body.description,
        complete: req.body.complete ? true : false
    });

    // ADD YOUR CODE HERE
    try {
        await TodoModel.updateOne({_id : req.params.id}, updatedTodo).exec();
        res.redirect('/todo/list');
    } catch (error) {
        console.log(error);
        res.end(error);
    }    
}

// Deletes a todo based on its id.
module.exports.performDelete = async (req, res, next) => {
    try {
        await TodoModel.deleteOne({_id: req.params.id});
        res.redirect('/todo/list'); 
    } catch (error) {
        console.log(error);
        res.end(error);
    }
}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {
    res.locals.title = 'Add new Todo';
    res.locals.todo = {};
    res.status(200).render('todo/add_edit');
}

// Processes the data submitted from the Add form to create a new todo
module.exports.processAddPage = async (req, res, next) => {

    console.log(req.body);

    let newTodo = TodoModel({
        _id: req.body.id,
        task: req.body.task,
        description: req.body.description,
        complete: req.body.complete ? true : false
    });

    newTodo['_id'] = mongoose.Types.ObjectId();

    try {
        await TodoModel.create(newTodo);
        res.redirect('/todo/list');
} catch (error) {
        console.log(error);
        res.end(error);
    }    
}