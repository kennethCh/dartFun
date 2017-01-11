import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import cx from 'classname';
import helper from '../helper';

let scoreArr = [];
 for(let i = 1; i <= 20; i++ ){
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
        <li onClick={ this.props.addPlayer } className={cx({ 'font-red': true, hidden: this.props.gameStatus.get('playing') })}><button>新增玩家</button></li>
        <li onClick={ this.handleReset.bind(this) }><button>RESET</button></li>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <li className={ cx({ hidden: this.props.gameStatus.get('playing') }) } style={ {textAlign: 'right'}}>種類：</li>
        <li className={ cx({ active: gameType === 301, hidden: this.props.gameStatus.get('playing') }) } onClick={ this.props.setGame.bind(null, 301) }><button>301</button></li>
        <li className={ cx({ active: gameType === 501, hidden: this.props.gameStatus.get('playing') }) } onClick={ this.props.setGame.bind(null, 501) }><button>501</button></li>
        <li className={ cx({ active: gameType === 701, hidden: this.props.gameStatus.get('playing') }) } onClick={ this.props.setGame.bind(null, 701) }><button>701</button></li>
        <li className={ cx({ active: gameType === 'criket', hidden: this.props.gameStatus.get('playing') }) } onClick={ this.props.setGame.bind(null, 'criket') }><button>Criket</button></li>
        <br/>
        <li className="btn-special"><button onClick={ this.scoreOnClick.bind(this, 'd' + 25) }>Bull</button></li>
        <li className="btn-special"><button onClick={ this.scoreOnClick.bind(this, 's' + 0) }>Miss</button></li>
        <br/>
        <li>1倍</li><br/>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-single" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 's' + (idx+1)) }>{ idx+1 }</button></li>)
        }) }
        <li>2倍</li><br/>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-double" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 'd' + (idx+1)) }>{ idx+1 }</button></li>)
        }) }
        <li>3倍</li><br/>
        { scoreArr.map( (score, idx) => {
          return (<li className="btn-triple" key={ idx }><button onClick={ this.scoreOnClick.bind(this, 't' + (idx+1)) }>{ idx+1 }</button></li>)
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
  if(point + currentShot < gameType) { return 0 }
  if(point + currentShot === gameType) { return 1 }
  if(point + currentShot > gameType) { return 2 }
}


export default connect(mapStateToProps, actions)(App);