import React from "react";

import { Centered } from "meteor/empirica:core";
const names = ["Kati", "Lepi", "Daru", "Soha"]; // for the players names to match avatar color

const avatarNames = {
  'blue' : [
    "Lincoln",
    "Leo",
    "Kayla",
    "Molly",
  ],
  'red' : [
    "Claire",
    "Jill",
    "Asher",
    "Wyatt",
  ]
}

const nameColor = {
  'blue' : [
    "#7A9CDC",
    "#5697C3",
    "#6DBCD2",
    "#2D7496",
  ],
  'red' : [
    "#A33C49",
    "#B55D42",
    "#BB786C",
    "#BB6C7C",
  ]
}

export default class TeamDetails extends React.Component {
  componentDidMount() {
    document.querySelector("main").scrollTo(0,0)
  }

  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="image">
          <img src={player.avatar} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.nameColor }}>
          {player.name}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

  render() {
    console.log(this.props)
    const {game, hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const teamColor = treatment.teamColor
    const player = {
      _id: 0,
      name: names[0],
      nameColor: nameColor['blue'][0],
      avatar: `/avatars/jdenticon/${avatarNames['blue'][0]}`
    };

    const otherPlayers = [
      {
        _id: 1,
        name: names[1],
        nameColor: nameColor['blue'][1],
        avatar: `/avatars/jdenticon/${avatarNames['blue'][1]}`
      }
    ];
    return (
      <Centered>
        <div className="instructions">
          <p>
            Importantly, you will not just play with one partner, you are on a team with
            <strong>
              {treatment.playerCount + 1} other people
            </strong>.

            Everyone on your team is a participant undertaking the same study at the same time as you.
            You will be paired off with different community members throughout the game.
            To help you identify yourself and differentiate each other in the
            team, we will assign an icon and a name to you when the game starts (as shown
            in the following example).
          </p>
          
          <br />
          <div className="social-interactions" style={{ margin: "auto" }}>
            <div className="status">
              <div className="players bp3-card">
                {this.renderPlayer(player, true)}
                {otherPlayers.map(p => this.renderPlayer(p))}
              </div>
              <div className="total-score bp3-card">
                <h6 className={"bp3-heading"}>Total Score</h6>

                <h2 className={"bp3-heading"}>{"$1.02"}</h2>
              </div>
            </div>
          </div>

          <br />
          <p>
            Note that the game allows for simultaneous and real-time actions.
            Each round will only end after everyone on your team has made a selection.
            There are a total of <b>16 rounds</b> in a row with each partner, so each
            picture will appear as the target multiple times with that
            partner. You will switch roles every 4 rounds, so both of you will
            get the chance to be Speaker and Listener.
          </p>

          <p>
            After the final round of your game with one partner, you will <b>switch partners</b> to
            play with someone on your team that you haven't talked to before!  Once you have played a game
            with <b>three different partners</b>, we'll ask you a few addition questions and you'll be on your way.
          </p>

        

          <button
            type="button"
            className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-icon-align-right" />
          </button>
        </div>
      </Centered>
    );
  }
}
