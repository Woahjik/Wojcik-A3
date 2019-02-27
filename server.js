const express = require('express');
const app = express();
var session = require('express-session');
app.use(session({ secret: 'server side', 
                 resave: false, 
                 saveUninitialized: false, 
                 cookie: {maxAge: 60000 }}));
app.get('/', list);
app.get('/sort', sort);
app.get('/add', add);
app.get('/remove', remove);
app.get('/clear', clear);
app.listen(process.env.PORT, process.env.IP, startHandler());

function startHandler()
{
    console.log('Server listening at ' + process.env.PORT); 
}

var songs = [];

function list(req, res)
{
    let result = {'songs': songs};
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
}

function sort(req, res)
{
    let result = {};
    result = {'songs': songs.sort()};
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
}

function add(req, res)
{
    let result = {};
    try
    {
        if(req.query.song == undefined || req.query.song == "")
            throw Error('Please enter a song name');
        req.session.song = req.query.song;
        for(var a = 0; a < songs.length; a++)
        {
            if(songs[a] == req.session.song)
                throw Error('this song is already listed');
        }
        songs.push(req.session.song);
        result = {'songs': songs};
    } 
    catch(e)
    {
        result = {'error': e.message};
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
}

function remove(req, res)
{
    let result = {};
    try
    {
        if(req.query.song == undefined || req.query.song == "")
            throw Error('Please enter a song name');
        req.session.song = req.query.song;
        var l = songs.length;
        for(var a = 0; a < songs.length; a++)
        {
            if(req.session.song == songs[a])
            {
                var spare = songs[songs.length - 1];
                songs[songs.length - 1] = songs[a];
                songs[a] = spare;
                songs.pop();
            }
        }
        if(l == songs.length)
            throw Error('This song is not listed');
        
        result = {'songs': songs};
    }
    catch(e)
    {
        result = {'error': e.message};
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
}

function clear(req, res)
{
    let result = {};
    songs = [];
    songs.length= 0;
    result = {'songs': songs};
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end('');
}
