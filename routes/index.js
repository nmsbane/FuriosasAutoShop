var express = require('express');
var router = express.Router();
var api = require('../lib/api');
var ascending = true;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/*
* Task 1:
* Make models alphabetically sortable (ascending, descending, default)
*/
router.get('/models', function(req, res, next) {
	// use api to get models and render output
	api.fetchModels().
		then(function(finalResult){
			var models;
			if(ascending){
				models = finalResult.sort();
			} else {
				models = finalResult.sort().reverse();
			}
			ascending = !ascending;
			res.render('models', {'models': models});		
		});
	
});

/*
* Task 2:
* Make services filterable by type (repair, maintenance, cosmetic)
*/
router.get('/services', function(req, res, next) {
	// use api to get services and render output
	api.fetchServices().
		then(function(finalResult) {
			var type = req.query.type;
			var servicesResult = [];
			if(type){
				finalResult.forEach(function(serviceType) {
					if (serviceType.type === type) {
						servicesResult.push(serviceType);
					}	
				});
			}
			else{
				servicesResult = finalResult;
			}
			res.render('services', {'services': servicesResult, 'selected': type});
		})
	
});

/*
* Task 3:
* Bugfix: Something prevents reviews from being rendered
* Make reviews searchable (content and source)
*/
router.get('/reviews', function(req, res, next) {
	return Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
		.then(function(reviews) {
			var finalReviews = [];
			for(var i = 0; i < 2; i++) {
				reviews[i].forEach(function(review) {
					finalReviews.push(review);	
				});
			}
			
			var q = req.query.q;
			var searchResults = [];
			if(q) {
				finalReviews.forEach(function(review) {
					if(review.content.match(q) || review.source.match(q)){
						searchResults.push(review);	
					};
				});
			}
			if(searchResults.length > 0) {
				finalReviews = searchResults;
			}
			res.render('reviews', {reviews: finalReviews});
		});
});

module.exports = router;
