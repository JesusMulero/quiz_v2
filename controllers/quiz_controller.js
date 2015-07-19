var models = require('../models/models.js');

// Autoload - factoriza el codigo para rutas con :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz){
	if (quiz){
		req.quiz = quiz;
		next();
	} else {
		next(new Error('No existe quizId=' + quizId));
	}
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes con o sin texto a buscar ?search=texto
exports.index = function(req, res) {
  if (req.query.search){
    var search = '%' + req.query.search.replace(/\s/g, '%') + '%';
    models.Quiz.findAll(
      {
	 where: ["pregunta like ?", search],
	 order: [[ 'pregunta', 'ASC']]
      }
    ).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes});
    }).catch(function(error) { next(error);});
  } else { 
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index', { quizes: quizes});
    }).catch(function(error) { next(error);});
  }
};
 
// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(
    { pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build( req.body.quiz );

  // guardar en BD pregunta y respuesta
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');  
  }) // redireccion a la lista de preguntas 
};

// GET /author
exports.author = function(req, res){
	res.render('author', {});
};
