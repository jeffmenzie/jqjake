import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { challenges } from "../../jqjake-api/src/challenges";
import Challenge from "./Challenge";
import About from "./About";

function App() {
    const firstChallengeId = challenges.find((e) => e.challengeIsFirst === true).challengeId;
    const [uid, setUid] = useState(null);
    const [mostRecentChallenge, setMostRecentChallenge] = useState(localStorage.getItem("mostRecentChallenge") ?? firstChallengeId);

    /* run on initial load */
    useEffect(() => {
        const uidFromLocalStorage = localStorage.getItem("uid");
        if (uidFromLocalStorage) {
            setUid(uidFromLocalStorage);
        } else {
            const newUid =
                "u" +
                Array(7)
                    .fill(0)
                    .map((x) => Math.random().toString(36).charAt(2))
                    .join("");
            localStorage.setItem("uid", newUid);
            setUid(newUid);
        }
    }, []);

    return (
        <div>
            <Switch>
                <Route path="/">{(params) => <RootForwarder mostRecentChallenge={mostRecentChallenge} />}</Route>

                <Route path="/challenge/:challengeId">{(params) => <Challenge params={params} challenges={challenges} uid={uid} />}</Route>
                <Route path="/about">
                    <About routedFrom={"about"} challenges={challenges} />
                </Route>
                <Route path="/challenge">Challenge not found</Route>
                <Route>
                    <About routedFrom={"defaultNotFound"} challenges={challenges} />
                </Route>
            </Switch>
        </div>
    );
}

const RootForwarder = (props) => {
    const redirectToChallenge = `/challenge/${props.mostRecentChallenge}`;

    return (
        <div>
            <Redirect to={redirectToChallenge} replace />
        </div>
    );
};

export default App;
