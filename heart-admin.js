var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(express.static(__dirname + '/public'));
// use res.render to load up an ejs view file
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/login', function(req, res) {
    res.render('pages/login', {
        title_page: 'Login'
    });
});
app.get('/', function(req, res) {
    res.render('pages/dashboard', {
        title_page: 'Dashboard'
    });
});
app.get('/users', function(req, res) {
    res.render('pages/users/list', {
        title_page: 'Users'
    });
});
app.get('/users/view/:id', function(req, res) {
    res.render('pages/users/view', {
        title_page: 'User'
    });
});
app.get('/news', function(req, res) {
    res.render('pages/news/list', {
        title_page: 'Artikel'
    });
});
app.get('/news/add', function(req, res) {
    res.render('pages/news/add', {
        title_page: 'Artikel'
    });
});
app.get('/news/edit/:id', function(req, res) {
    res.render('pages/news/edit', {
        title_page: 'Artikel'
    });
});
app.get('/banners', function(req, res) {
    res.render('pages/banners/list', {
        title_page: 'Banner'
    });
});
app.get('/banners/add', function(req, res) {
    res.render('pages/banners/add', {
        title_page: 'Banner'
    });
});
app.get('/banners/edit/:id', function(req, res) {
    res.render('pages/banners/edit', {
        title_page: 'Banner'
    });
});
app.get('/nurse', function(req, res) {
    res.render('pages/nurse/list', {
        title_page: 'Nurse'
    });
});
app.get('/nurse/add', function(req, res) {
    res.render('pages/nurse/add', {
        title_page: 'Nurse'
    });
});
app.get('/nurse/edit/:id', function(req, res) {
    res.render('pages/nurse/edit', {
        title_page: 'Nurse'
    });
});
app.get('/donors', function(req, res) {
    res.render('pages/donors/list', {
        title_page: 'Donors'
    });
});
app.get('/donors/add', function(req, res) {
    res.render('pages/donors/add', {
        title_page: 'Donors'
    });
})
app.get('/donors/edit/:id', function(req, res) {
    res.render('pages/donors/edit', {
        title_page: 'Donors'
    });
});
app.get('/symptom', function(req, res) {
    res.render('pages/symptom/list', {
        title_page: 'Symptom'
    });
});
app.get('/symptom/add', function(req, res) {
    res.render('pages/symptom/add', {
        title_page: 'Symptom'
    });
});
app.get('/symptom/edit/:id', function(req, res) {
    res.render('pages/symptom/edit', {
        title_page: 'Symptom'
    });
});
app.get('/symptom/view/:id', function(req, res) {
    res.render('pages/symptom/view', {
        title_page: 'Symptom'
    });
});
app.get('/symptom/edit-symptom2/:id', function(req, res) {
    res.render('pages/symptom/editsymptom2', {
        title_page: 'Symptom'
    });
});
app.get('/symptom/edit-symptom3/:id', function(req, res) {
    res.render('pages/symptom/editsymptom3', {
        title_page: 'Symptom'
    });
});
app.get('/questioner', function(req, res) {
    res.render('pages/questioner/list', {
        title_page: 'Questioner'
    });
});
app.get('/questioner/view/:id', function(req, res) {
    res.render('pages/questioner/view', {
        title_page: 'Questioner'
    });
});
app.get('/questioner/submited/:fid_user/:fid_question_type', function(req, res) {
    res.render('pages/questioner/viewsubmited', {
        title_page: 'Questioner'
    });
});


const port = process.env.PORT;
app.listen(port, () => console.info(`Admin Web App listening on port ${port}`))