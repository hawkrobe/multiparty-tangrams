import React from "react";

import Tangram from "./Tangram.jsx";
import Timer from "./Timer.jsx";
import { HTMLTable } from "@blueprintjs/core";
import { StageTimeWrapper } from "meteor/empirica:core";

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    // We want each participant to see tangrams in a random but stable order
    // so we shuffle at the beginning and save in state
    this.state = {
      activeButton: false
    };
  }

  render() {
    const { game, round, stage, player } = this.props;
    const task = round.get("task");
    const tangramURLs = player.get('tangramURLs');
    let tangramsToRender;
    if (tangramURLs) {
      tangramsToRender = tangramURLs.map((tangram, i) => (
        <Tangram
          key={tangram}
          tangram={tangram}
          tangram_num={i}
          round={round}
          stage={stage}
          game={game}
          player={player}
          />
      ));
    }
    const feedback = (player.get('clicked') == '' ? '' :
                      player.get('clicked') == round.get('task').target ? "Correct! You earned 2 points!" :
                      "Ooops, that wasn't the target! You earned no bonus this round.")
    return (
      <div className="task">
        <div className="board">
          <h1 className="roleIndicator"> You are the {player.get('role')}.</h1>
          <div className="all-tangrams">
            <div className="tangrams">
              {tangramsToRender}
            </div>
          </div>
          <h1 className="feedbackIndicator">  {feedback}</h1>
        </div>
      </div>
    );
  }
}
