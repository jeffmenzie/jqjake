import { stringifyJsonForChallengeInstruction } from "./common";

import "./ChallengeInstruction.css";

function ChallengeInstruction(props) {
    const challengeIntroduction = props.challengeIntroduction;
    const challengeInstruction = props.challengeInstruction;
    const challengeInstructionJson = props.challengeInstructionJson;

    const challengeInstructionInnerHtml = stringifyJsonForChallengeInstruction(challengeInstruction, challengeInstructionJson);

    return (
        <div>
            <div className="challengeTitle">{challengeIntroduction}</div>
            <div className="instructionContainer" dangerouslySetInnerHTML={{ __html: challengeInstructionInnerHtml }} />
        </div>
    );
}

export default ChallengeInstruction;
