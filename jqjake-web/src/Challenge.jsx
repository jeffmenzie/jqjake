import { useState, useEffect, useCallback, useRef } from "react";
import { navigate } from "wouter/use-browser-location";
import debounce from "debounce-promise";
import OutputPane from "./OutputPane";

import ChallengeInstruction from "./ChallengeInstruction";
import { apiUrlPrefix, domainPrefix } from "./EnvironmentSpecific";

import { SvgCopy, SvgRightArrow, SvgLeftArrow, SvgCompletedCheck } from "./Svg";

import styles from "./Challenge.module.css";

function Challenge(props) {
    const challenges = props.challenges;
    const uid = props.uid;
    const totalNumberOfChallenges = props.challenges.length;

    /* stateless variables */
    const listOfChallenges = challenges.map((e) => ({
        challengeIntroduction: e.challengeIntroduction,
        challengeId: e.challengeId,
    }));

    const selectDropDownListOfChallenges = challenges.map((e) => (
        <option key={e.challengeId} value={e.challengeId}>
            {e.challengeIntroduction}
        </option>
    ));

    /* state */
    const [currentlySelectedchallengeId, setCurrentlySelectedchallengeId] = useState(props.params.challengeId);

    const [challengeFilterInput, setChallengeFilterInput] = useState({
        filterValue: "",
        optionR: false,
        optionArg: false,
        argName: "",
        argValue: "",
    });

    const [correctResponses, setCorrectResponses] = useState([
        {
            challengeId: "placeholder",
            challengeCorrectResponse: "",
            chellengeCorrectRespondIsValidJson: false,
        },
    ]);

    const [argInputDisabled, setArgInputDisabled] = useState(true);

    const [correctResponse, setCorrectResponse] = useState({});

    const [challenge, setChallenge] = useState(props.challenges.find((e) => e.challengeId === currentlySelectedchallengeId));

    if (challenge === undefined) {
        navigate("/notfound", { replace: true });
    }

    const [responseData, setResponseData] = useState({
        userIsCorrect: null,
        userResponse: null,
        exitStatus: null,
        errorMessage: null,
    });

    const [completedChallenges, setCompletedChallenges] = useState(JSON.parse(localStorage.getItem("completedChallenges") ?? "[]"));

    const [completedNumberOfChallenges, setCompletedNumberOfChallenges] = useState(0);
    const [currentChallengeCompletedSuccessfully, setCurrentChallengeCompletedSuccessfully] = useState(false);

    const [nextAndPreviousChallenge, setNextAndPreviousChallenge] = useState({
        challengeIsFirst: true,
        challengeIsLast: true,
        nextChallenge: null,
        previousChallenge: null,
    });

    const divAnchorForScrolling = useRef(null);

    /* run on initial load */

    useEffect(() => {
        const fetchCorrectResponses = async () => {
            const response = await fetch(`${apiUrlPrefix}correctresponses`);
            const responseData = await response.json();
            setCorrectResponses(responseData);
        };
        fetchCorrectResponses();

        setCompletedNumberOfChallenges(completedChallenges.length);
        setCurrentChallengeCompletedSuccessfully(completedChallenges.includes(currentlySelectedchallengeId) ? true : false);

        // remove any challenges that no longer exist
        // TO DO !!!
    }, []);

    /* run when currentlySelectedchallengeId changes */
    useEffect(() => {
        setCurrentlySelectedchallengeId(props.params.challengeId);
    }, [props.params.challengeId, correctResponses]);

    useEffect(() => {
        setChallenge(props.challenges.find((e) => e.challengeId === currentlySelectedchallengeId));
        localStorage.setItem("mostRecentChallenge", currentlySelectedchallengeId);
        setChallengeFilterInput({ filterValue: "", optionR: false, optionArg: false, argName: "", argValue: "" });
        setResponseData({});
        setCorrectResponse(
            correctResponses.find((e) => e.challengeId === currentlySelectedchallengeId) ??
                correctResponses.find((e) => e.challengeId === "placeholder")
        );

        setCompletedChallenges(JSON.parse(localStorage.getItem("completedChallenges") ?? "[]"));

        const isFirstChallenge = challenges.find((e) => e.challengeIsFirst === true).challengeId === currentlySelectedchallengeId;
        const isLastChallenge = challenges.find((e) => e.challengeIsLast === true).challengeId === currentlySelectedchallengeId;

        const challengeIndex = challenges.findIndex((e) => e.challengeId === currentlySelectedchallengeId);
        const nextChallenge = challenges[challengeIndex + 1] === undefined ? undefined : challenges[challengeIndex + 1].challengeId;

        const previousChallenge = challenges[challengeIndex - 1] === undefined ? undefined : challenges[challengeIndex - 1].challengeId;

        setNextAndPreviousChallenge({
            challengeIsFirst: isFirstChallenge,
            challengeIsLast: isLastChallenge,
            nextChallenge: nextChallenge,
            previousChallenge: previousChallenge,
        });

        divAnchorForScrolling.current.scrollIntoView();
    }, [currentlySelectedchallengeId, correctResponses]);

    // misc effects
    useEffect(() => {
        setCompletedNumberOfChallenges(completedChallenges.length);
        setCurrentChallengeCompletedSuccessfully(completedChallenges.includes(currentlySelectedchallengeId) ? true : false);
    }, [completedChallenges]);

    useEffect(() => {
        const documentTitle = "jq Jake - ".concat(challenge.challengeIntroduction);
        document.title = documentTitle;
    }, [challenge.challengeIntroduction]);

    useEffect(() => {
        if (challengeFilterInput.optionArg === true) {
            setArgInputDisabled(false);
        } else {
            setArgInputDisabled(true);
        }
    }, [challengeFilterInput.optionArg]);

    const refocusOnChallengeIdChange = useCallback(
        (inputField) => {
            if (inputField) {
                inputField.focus();
            }
        },
        [currentlySelectedchallengeId]
    );

    /* functions */
    const formHandler = (event) => {
        event.preventDefault();
    };

    const fetchUserResponseDebounced = async (userFilter, currentChallenge, completedChlngs) => {
        const response = await fetch(`${apiUrlPrefix}validate/`, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                challengeId: currentChallenge,
                uid: uid,
                filter: userFilter,
            }),
        });
        const responseJson = await response.json();

        if (responseJson.userIsCorrect === true && !completedChlngs.includes(currentChallenge)) {
            localStorage.setItem("completedChallenges", JSON.stringify([...completedChlngs, currentChallenge]));
            setCompletedChallenges([...completedChlngs, currentChallenge]);
        }

        setResponseData(responseJson);
    };

    const fetchUserResponse = useCallback(debounce(fetchUserResponseDebounced, 500), []);

    const updateChallengeFilterInput = (source, event) => {
        if (source === "filterInput") {
            setChallengeFilterInput({ ...challengeFilterInput, filterValue: event.target.value });
            fetchUserResponse(
                { ...challengeFilterInput, filterValue: event.target.value },
                currentlySelectedchallengeId,
                completedChallenges
            );
        } else if (source === "optionR") {
            setChallengeFilterInput({ ...challengeFilterInput, optionR: event.target.checked });
            fetchUserResponse(
                { ...challengeFilterInput, optionR: event.target.checked },
                currentlySelectedchallengeId,
                completedChallenges
            );
        } else if (source === "optionArg") {
            setChallengeFilterInput({ ...challengeFilterInput, optionArg: event.target.checked });
            fetchUserResponse(
                { ...challengeFilterInput, optionArg: event.target.checked },
                currentlySelectedchallengeId,
                completedChallenges
            );
        } else if (source === "argInputName") {
            setChallengeFilterInput({ ...challengeFilterInput, argName: event.target.value });
            fetchUserResponse({ ...challengeFilterInput, argName: event.target.value }, currentlySelectedchallengeId, completedChallenges);
        } else if (source === "argInputValue") {
            setChallengeFilterInput({ ...challengeFilterInput, argValue: event.target.value });
            fetchUserResponse({ ...challengeFilterInput, argValue: event.target.value }, currentlySelectedchallengeId, completedChallenges);
        }
    };

    const copyCurlCommandToLocalClipboard = (c) => {
        // const origin = window.location.origin;
        const command = `curl ${domainPrefix}challenge/` + c + " | jq '.'";
        navigator.clipboard.writeText(command);
    };

    const challengeNavigateByOne = (direction, challengeDirectionInformation) => {
        const navigateTo =
            direction === "p"
                ? challengeDirectionInformation.previousChallenge
                : direction === "n"
                ? challengeDirectionInformation.nextChallenge
                : undefined;

        navigate(`/challenge/${navigateTo}`, { replace: true });
    };

    const challengeDropDownChangeHandler = (event) => {
        navigate(`/challenge/${event.target.value}`, { replace: true });
    };

    return (
        <div className={styles.outerFlexContainer}>
            <div className={styles.leftFlexContainer}>
                <div ref={divAnchorForScrolling}>
                    <div className={styles.titleBar}>
                        <div className={styles.titleBarLogo}>jq Jake</div>
                        <div className={styles.titleBarDescription}>Learn jq by helping Jake solve an art heist</div>
                    </div>

                    <ChallengeInstruction
                        challengeIntroduction={challenge.challengeIntroduction}
                        challengeInstruction={challenge.challengeInstruction}
                        challengeInstructionJson={challenge.challengeInstructionJson}
                    />
                </div>
                <div>
                    <div
                        // combine classes
                        className={[styles.interactionContainer, styles.interactionContainerIncomplete].join(" ")}>
                        <div
                            className={[
                                styles.completedSuccessfullyFlexContainer,
                                currentChallengeCompletedSuccessfully === false ? styles.completedSuccessfullyFlexContainerHide : "",
                            ].join(" ")}>
                            <span className={styles.completedSuccessfullyText}>CHALLENGE COMPLETED</span>
                            <SvgCompletedCheck />
                        </div>

                        <div className={styles.interactionLabelText}>FILTER</div>

                        <form onSubmit={formHandler}>
                            <input
                                className={styles.interactionFilterInput}
                                type="text"
                                onChange={(e) => updateChallengeFilterInput("filterInput", e)}
                                value={challengeFilterInput.filterValue}
                                // autoFocus
                                ref={refocusOnChallengeIdChange}
                            />
                        </form>
                        <div className={styles.interactionLabelText}>OPTIONS</div>
                        <div className={styles.interactionOption}>
                            <form onSubmit={formHandler}>
                                <div className={styles.interactionOptionItemContainer}>
                                    <div className={styles.interactionOptionWrapper}>
                                        <input
                                            className={styles.interactionOptionCheckbox}
                                            type="checkbox"
                                            onChange={(e) => updateChallengeFilterInput("optionR", e)}
                                            checked={challengeFilterInput.optionR}
                                        />
                                        -r
                                    </div>
                                    <div className={styles.interactionOptionWrapper}>
                                        <input
                                            className={styles.interactionOptionCheckbox}
                                            type="checkbox"
                                            onChange={(e) => updateChallengeFilterInput("optionArg", e)}
                                            checked={challengeFilterInput.optionArg}
                                        />
                                        --arg
                                    </div>
                                    <input
                                        className={[
                                            styles.interactionArgInput,
                                            argInputDisabled === true ? styles.argShow : styles.argHide,
                                        ].join(" ")}
                                        type="text"
                                        disabled={argInputDisabled}
                                        placeholder="Arg Name"
                                        onChange={(e) => updateChallengeFilterInput("argInputName", e)}
                                        value={challengeFilterInput.argName}
                                    />
                                    <input
                                        className={[
                                            styles.interactionArgInput,
                                            argInputDisabled === true ? styles.argShow : styles.argHide,
                                        ].join(" ")}
                                        type="text"
                                        disabled={argInputDisabled}
                                        placeholder="Arg Value"
                                        onChange={(e) => updateChallengeFilterInput("argInputValue", e)}
                                        value={challengeFilterInput.argValue}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className={styles.navigationFlexContainer}>
                            <div className={styles.navigationButtonParentLeft}>
                                <button
                                    disabled={nextAndPreviousChallenge.challengeIsFirst}
                                    className={styles.forwardAndBackButtons}
                                    onClick={() => challengeNavigateByOne("p", nextAndPreviousChallenge)}>
                                    <SvgLeftArrow /> <span className={styles.navigationButtonText}>BACK</span>
                                </button>
                            </div>
                            <div className={styles.navigationSelectParent}>
                                <select
                                    className={styles.navigationSelect}
                                    value={currentlySelectedchallengeId}
                                    onChange={challengeDropDownChangeHandler}>
                                    {selectDropDownListOfChallenges}
                                </select>
                            </div>
                            <div className={styles.navigationButtonParentRight}>
                                <button
                                    disabled={nextAndPreviousChallenge.challengeIsLast}
                                    className={styles.forwardAndBackButtons}
                                    onClick={() => challengeNavigateByOne("n", nextAndPreviousChallenge)}>
                                    <span className={styles.navigationButtonText}>NEXT</span>

                                    <SvgRightArrow />
                                </button>
                            </div>
                        </div>

                        <div className={styles.interactionButtonsFlexContainer}>
                            <div className={styles.completionStatusText}>
                                <div className={styles.completionStatusTextInner}>
                                    Completed challenges: {completedNumberOfChallenges}/{totalNumberOfChallenges}
                                </div>
                            </div>

                            <button
                                className={styles.interactionButton}
                                onClick={() => {
                                    copyCurlCommandToLocalClipboard(currentlySelectedchallengeId);
                                }}>
                                curl Challenge Locally <SvgCopy />
                            </button>

                            <button
                                className={styles.interactionButton}
                                onClick={() => {
                                    fetchUserResponseDebounced(
                                        {
                                            filterValue: challenge.challengeAnswer,
                                            optionR: challenge.challengeAnswerOptions.rawFilter,
                                            optionArg: challenge.challengeAnswerOptions.optionArg,
                                            argName: challenge.challengeAnswerOptions.argName,
                                            argValue: challenge.challengeAnswerOptions.argValue,
                                        },
                                        currentlySelectedchallengeId,
                                        completedChallenges
                                    );
                                    setChallengeFilterInput({
                                        filterValue: challenge.challengeAnswer,
                                        optionR: challenge.challengeAnswerOptions.rawFilter,
                                        optionArg: challenge.challengeAnswerOptions.optionArg,
                                        argName: challenge.challengeAnswerOptions.argName,
                                        argValue: challenge.challengeAnswerOptions.argValue,
                                    });
                                }}>
                                Show Answer
                            </button>
                        </div>
                    </div>

                    <div className={styles.navigationLinkContainer}>
                        <a href="/about" target="_blank">
                            About
                        </a>
                        |{" "}
                        <a href="https://github.com/jeffmenzie/jqjake" target="_blank">
                            GitHub
                        </a>
                        |{" "}
                        <a href="https://jqlang.github.io/jq/manual/" target="_blank">
                            jq Documentation
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.rightFlexContainer}>
                <div>
                    <OutputPane
                        paneTitle={"INPUT JSON"}
                        displayValue={challenge.challengeJson}
                        userResponseIsCorrect={null}
                        userIsCorrect={null}
                        exitStatus={null}
                        errorMessage={null}
                        challengeIndentOverride={challenge.challengeIndentOverride ?? null}
                        inputIsEmpty={false}
                    />
                </div>
                <div>
                    <OutputPane
                        paneTitle={"TARGET CHALLENGE OUTPUT"}
                        displayValue={correctResponse.challengeCorrectResponse}
                        userIsCorrect={null}
                        exitStatus={null}
                        errorMessage={null}
                        challengeIndentOverride={null}
                        inputIsEmpty={false}
                    />
                </div>
                <div>
                    <OutputPane
                        paneTitle={"ACTUAL CHALLENGE OUTPUT"}
                        displayValue={responseData.userResponse}
                        userIsCorrect={responseData.userIsCorrect}
                        exitStatus={responseData.exitStatus}
                        errorMessage={responseData.errorMessage}
                        challengeIndentOverride={null}
                        inputIsEmpty={challengeFilterInput.filterValue === "" ? true : false}
                    />
                </div>
            </div>
        </div>
    );
}

export default Challenge;
