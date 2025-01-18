import styles from "./OutputPane.module.css";

import { syntaxHighlight } from "./common";

function OutputPane(props) {
    const paneTitle = props.paneTitle;
    const displayValue = props.inputIsEmpty === true ? "" : props.errorMessage ?? props.displayValue;
    const displayType = typeof displayValue;

    const userIsCorrect = props.userIsCorrect;
    const exitStatus = props.inputIsEmpty === true ? "" : props.exitStatus ?? 0;

    const indentLength = props.challengeIndentOverride ?? 4;

    let displayValueIsValidJson;

    if (displayType === "undefined") {
        displayValueIsValidJson = false;
    } else if (displayType === "string") {
        try {
            JSON.parse(displayValue);
            displayValueIsValidJson = true;
        } catch (error) {
            displayValueIsValidJson = false;
        }
    } else {
        try {
            JSON.stringify(displayValue);
            displayValueIsValidJson = true;
        } catch (error) {
            displayValueIsValidJson = false;
        }
    }

    let display;
    if (displayValueIsValidJson === true && displayType !== "string") {
        display = syntaxHighlight(JSON.stringify(displayValue, null, indentLength));
    } else if (displayValueIsValidJson === true && displayType === "string") {
        display = syntaxHighlight(JSON.stringify(JSON.parse(displayValue), undefined, indentLength));
    } else {
        display = displayValue;
    }

    const wrappedDisplay =
        display === undefined
            ? "Loading..."
            : !display
            ? display
            : display.includes("\n") === true
            ? display
                  .split("\n")
                  .map((e) => {
                      return "<div class='formatted-code'>" + e + "</div>";
                  })
                  .join("")
            : "<div class='formatted-code'>" + display + "</div>";

    function createMarkup() {
        return { __html: "<div class='wrapped-display-container'>" + wrappedDisplay + "<div>" };
    }

    return (
        <div className={styles.outputPaneContainer}>
            <div className={styles.titleBar}>
                <span className={styles.title}>{paneTitle}</span>
                <span className={exitStatus != 0 ? styles["hasErrorForTitle"] : styles["noErrorForTitle"]}>
                    {paneTitle === "ACTUAL CHALLENGE OUTPUT" ? "ERROR" : ""}
                </span>
                <span className={userIsCorrect === true ? styles["isCorrectForTitle"] : styles["notCorrectForTitle"]}>
                    {userIsCorrect === true ? "CORRECT" : ""}
                </span>
            </div>
            <div className={styles.output}>
                <div className={styles.outputContent}>
                    <div className={exitStatus != 0 ? styles["hasErrorForOutput"] : ""} dangerouslySetInnerHTML={createMarkup()} />
                    {exitStatus != 0 ? <br /> : ""}

                    {exitStatus != 0 ? (
                        <div className={styles.hasErrorForOutput}>{"(exit status: " + exitStatus.toString() + ")"}</div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}

export default OutputPane;
