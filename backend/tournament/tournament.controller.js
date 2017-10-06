const tournamentService = require('./tournament.service');
const matchService = require('../match/match.service');

const async = require('async');


module.exports = {
  renderCreate: (req, res) => {
    return res.render('tournament/createTournament');
  },

  createNewTournament: (req, res) => {
    let name = req.body.name;
    let logo = req.body.body;
    let info = req.body.info;
    let team = req.body.teamArray;
    let type = req.body.type;
    //TODO validate input

    let data = {
      name: name,
      logo: logo,
      info: info,
      team: team.split(',').map(function(x){return {team_id: x}}),
      type: type
    }
    tournamentService.createNewTournament(data, (err, result) => {
      console.log(err);
      console.log(result);
      if(err){
        req.flash('error', { msg: 'An error when create new tournament!' });
        return res.redirect('/tournament/create');
      }
      req.flash('success', { msg: 'Create new tournament successfully.' });
      return res.redirect('/tournament/create');
    });
  },

  renderListTournament: (req, res) => {
    tournamentService.getAll((err, results) => {
      if(err){
        //TODO hanfle error
      }
      res.render('tournament/listTournament', {list: results});
    })
  },

  renderScore: (req, res) => {
    let tournamentId = req.params.tournamentId;
    async.parallel({
      getTournament: (asyncCallback) => {
        tournamentService.getByIdPopulateTeam(tournamentId, asyncCallback);
      }, 
      getSingleMatch: (asyncCallback) => {
        matchService.getAllSingleMatch(tournamentId, asyncCallback);
      },
      getFoursomesMatch: (asyncCallback) => {
        matchService.getAllFoursomesMatch(tournamentId, asyncCallback);
      }
    }, (errs, results) => {
      if(errs){
        //todo handle errors
      }
      console.log(results);
      return res.render('tournament/score', {results: results});
      // return res.json(results);
    });

    
  },

  renderUpdate: (req, res) => {
    let tournamentId = req.params.id;
    tournamentService.getById(tournamentId, (err, result) => {
      if(err){
        //TODO handle error and return
      }
      if(!result){
        // TODO handle and return err
      }
      return res.render('tournament/editTournament', {tournament: result});
    })
  }
}