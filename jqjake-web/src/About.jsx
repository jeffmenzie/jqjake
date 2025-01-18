import { Link } from "wouter";
import { useEffect } from "react";
import styles from "./About.module.css";

function About(props) {
    const routedFrom = props.routedFrom;
    const isNotFound = routedFrom === "defaultNotFound" ? true : false;
    const challenges = props.challenges;

    const DisplayNotFoundErrorMessage = () => {
        return (
            <div className={styles.notFound}>
                PAGE NOT FOUND <br />
                Perhaps you'll find what you were looking for below...
            </div>
        );
    };

    const challengeList = challenges.map((e) => (
        <li key={e.challengeId}>
            <Link replace href={"/challenge/" + e.challengeId}>
                {e.challengeIntroduction}
            </Link>
        </li>
    ));

    useEffect(() => {
        const documentTitle = "jq Jake - ".concat(isNotFound === true ? "Page Not Found" : "About");
        document.title = documentTitle;
    }, []);

    return (
        <div className={styles.aboutPage}>
            <div className={styles.aboutContainer}>
                {isNotFound && <DisplayNotFoundErrorMessage />}

                <div className={styles.boxContainer}>
                    <div className={styles.boxTitle}>ABOUT</div>
                    <div className={styles.boxContent}>
                        jq is a popular cross-platform command line utility for processing and manipulating JSON.
                        <p />
                        jq Jake is designed to introduce the fundamentals of jq through a series of interactive challenges.
                        <p />
                        This site is not an exhaustive representation of all of the features and functionality available in jq. For a more
                        complete list of jq's features please refer to the official{" "}
                        <a href="https://jqlang.github.io/jq/manual/">jq documentation</a>. <p />
                    </div>
                </div>

                <div className={styles.boxContainer}>
                    <div className={styles.boxTitle}>COMPLETE LIST OF CHALLENGES</div>
                    <div className={styles.boxContent}>{challengeList}</div>
                </div>
            </div>
        </div>
    );
}

export default About;
