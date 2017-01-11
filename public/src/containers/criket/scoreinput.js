import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import cx from 'classname';
import helper from '../../helper';

let scoreArr = [];
 for(let i = 15; i <= 20; i++ ){
  scoreArr.push(i);          
 }
 let round = 0;
class App extends Component {
  constructor(props) {
    super(props);

  }
  scoreOnClick(num) {
    if(this.props.players.size === 0) { alert('請先新增玩家'); return };
    const player = this.props.players.get(this.props.currentPlayer);
    const records = player.get('records');
    const totalScore = helper.recordsToSum(records);
    const judge = checkEndCondition(totalScore, helper.symbolToNum(num), this.props.gameStatus.get('type'));


    this.props.updateScore(num, this.props.currentPlayer, this.props.gameStatus.get('currentRound'), round);

    if(judge === 1) { alert('player' + (this.props.currentPlayer + 1) + 'wins') }
    if(judge === 2) { 
      this.props.burst(this.props.currentPlayer, this.props.gameStatus.get('currentRound')); 
      round = 0;
      const allPlayer = this.props.players.size;
      const isNextRound = +this.props.currentPlayer == (allPlayer -1);
      this.props.updateRound(isNextRound, nextPlayer(this.props.players.size, this.props.currentPlayer));
      return; 
    }
    round++;
    if(round >= 3) {
      round = 0;
      const allPlayer = this.props.players.size;
      const isNextRound = +this.props.currentPlayer == (allPlayer -1);
      this.props.updateRound(isNextRound, nextPlayer(this.props.players.size, this.props.currentPlayer));
    }
  }
  handleReset() {
    var shouldReset = confirm('確定要重來?');
    if (shouldReset) {
      this.props.reset();
    } 
  }
  render() {
    return (
      <div>
        { this.renderScoreBtn() }
      </div>
    );
  }
  renderScoreBtn() {
    const gameType = this.props.gameStatus.get('type');
    return (
      <ul className="score-btn-list">
        <li onClick={ this.props.addPlayer }><button>新增玩家</button></li>
        <li onClick={ this.handleReset.bind(this) }><button>RESET</button></li>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <li style={ {textAlign: 'right'}}>種類：</li>
        <li className={ cx({ active: gameType === 301 }) } onClick={ this.props.setGame.bind(null, 301) }><button>301</button></li>
        <li className={ cx({ active: gameType === 501 }) } onClick={ this.props.setGame.bind(null, 501) }><button>501</button></li>
        <li className={ cx({ active: gameType === 701 }) } onClick={ this.props.setGame.bind(null, 701) }><button>701</button></li>
        <li className={ cx({ active: gameType === 701 }) } onClick={ this.props.setGame.bind(null, 'criket') }><button>Criket</button></li>
        <br/>
        <li className="btn-special"><button onClick={ this.scoreOnClick.bind(this, 's' + 50) }>Bull</button></li>
        <li className="btn-special"><button onClick={ this.scoreOnClick.bind(this, 0) }>Miss</button></li>
        <br/>
        <li>一倍</li>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-single" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 's' + (idx+15)) }>{ idx+15 }</button></li>)
        }) }
        <li className="btn-single"><button onClick={ this.scoreOnClick.bind(this, 'd25') }>Bull</button></li>
        <br/>
        <li>兩倍</li>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-double" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 'd' + (idx+15)) }>{ idx+15 }</button></li>)
        }) }
        <li className="btn-double"><button onClick={ this.scoreOnClick.bind(this, 'd25') }>Bull</button></li>
        <br />
        <li>三倍</li>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-triple" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 't' + (idx+15)) }>{ idx+15 }</button></li>)
        }) }
      </ul>
    )
  }
}

function mapStateToProps(state) {
  return {
    players:  state.players,
    gameStatus:  state.gameStatus,
    currentPlayer:  state.currentPlayer
  }
}
function nextPlayer(sum, player) {
  if(player + 1 >= sum) {
    return 0;
  } else {
    return player + 1; 
  }
}



function checkEndCondition(point, currentShot, gameType) {
  console.log(point, currentShot, gameType)
  if(point + currentShot < gameType) { return 0 }
  if(point + currentShot === gameType) { return 1 }
  if(point + currentShot > gameType) { return 2 }
}


export default connect(mapStateToProps, actions)(App);