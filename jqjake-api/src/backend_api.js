import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import sqlite3 from "sqlite3";
import { execFileSync } from "child_process";
import { challenges as challengesWithoutCorrectResponses } from "./challenges.js";

const db = new sqlite3.Database("./src/jqjake_telemetry.db");

const app = express();
const port = 3005;
app.use(cors());
app.use(bodyParser.json());

console.log("Starting...");

// on start up create table if it doesn't exist
db.run(`
        CREATE TABLE IF NOT EXISTS "telemetry" (
            "t_id"	                INTEGER NOT NULL,
            "t_source"	            TEXT,
            "t_date"	            TEXT,
            "t_uid"	                TEXT,
            "t_challenge"	        TEXT,
            "t_response_is_correct"	INTEGER,
            PRIMARY KEY("t_id" AUTOINCREMENT)
        );
`);

// on startup calculate all correct responses
const challenges = challengesWithoutCorrectResponses.map((c) => {
    // default start with -c
    const responseArguments = ["-c"];

    // add -r argument, --arg arguments
    if (typeof c.challengeAnswerOptions !== "undefined") {
        c.challengeAnswerOptions.rawFilter === true ? responseArguments.push("-r") : null;
        c.challengeAnswerOptions.optionArg === true
            ? responseArguments.push("--arg") &&
              responseArguments.push(c.challengeAnswerOptions.argName) &&
              responseArguments.push(c.challengeAnswerOptions.argValue)
            : null;
    }

    // last step, add challengeAnswer
    responseArguments.push(c.challengeAnswer);

    const responseCorrect = execFileSync("jq", responseArguments, {
        input: JSON.stringify(c.challengeJson),
        timeout: 5000,
        maxBuffer: 1024 * 1024,
    }).toString();

    let responseCorrectIsValidJson;
    try {
        JSON.parse(responseCorrect);
        responseCorrectIsValidJson = true;
    } catch (error) {
        responseCorrectIsValidJson = false;
    }

    return {
        ...c,
        challengeId: c.challengeId,
        challengeCorrectResponse: responseCorrect,
        chellengeCorrectRespondIsValidJson: responseCorrectIsValidJson,
    };
});

const challengesCorrectResponses = challenges.map((c) => {
    return {
        challengeId: c.challengeId,
        challengeCorrectResponse: c.challengeCorrectResponse,
        chellengeCorrectRespondIsValidJson: c.chellengeCorrectRespondIsValidJson,
    };
});

const validChallenges = challenges.map((e) => e.challengeId);

const insertTelemetryDataValidation = (source, input, maxLength) => {
    if (source === "challengeId" && !validChallenges.includes(input)) {
        return "invalid challenge ID";
    } else {
        return input.toString().slice(0, maxLength);
    }
};

const insertTelemetry = (pSource, pUid, pChallengeId, pResponseIsCorrect) => {
    const source = pSource;
    const insertionDate = new Date().toISOString().slice(0, 10);
    const uid = pUid === null ? null : insertTelemetryDataValidation("pUid", pUid, 8);
    const challengeId = pChallengeId === null ? null : insertTelemetryDataValidation("challengeId", pChallengeId, 100);
    const responseIsCorrect = pSource === "direct" ? null : pResponseIsCorrect === true ? 1 : 0;

    try {
        db.run(`INSERT INTO "telemetry" ("t_source", "t_date", "t_uid", "t_challenge", "t_response_is_correct") VALUES(?,?,?,?,?)`, [
            source,
            insertionDate,
            uid,
            challengeId,
            responseIsCorrect,
        ]);
        return 0;
    } catch (err) {
        console.log(err);
        return 1;
    }
};

// start routes

// basic healthcheck
app.get("/api/healthcheck", (req, res) => {
    try {
        return res.status(200).send({ message: "ok" });
    } catch (err) {
        console.log(err.message);
        return res.status(400).send({ message: "an error ocurred" });
    }
});

// all correct responses
app.get("/api/correctresponses", (req, res) => {
    try {
        return res.status(200).send(challengesCorrectResponses);
    } catch (err) {
        console.log(err.message);
        return res.status(400).send({ message: "an error ocurred" });
    }
});

// direct resource, used when someone wants to curl challenge locally
app.get("/api/challenge/:challengeId?", (req, res) => {
    try {
        const pChallengeId = req.params.challengeId;
        if (!pChallengeId) {
            return res.status(400).send({ message: "missing or invalid challenge input parameter" });
        }

        const challenge = challenges.find((element) => element.challengeId === pChallengeId);
        insertTelemetry("direct", null, pChallengeId, null, null);
        return res.status(200).send(challenge.challengeJson);
    } catch (err) {
        return res.status(500).send({ message: "an error ocurred" });
    }
});

// from web app
app.post("/api/validate", (req, res) => {
    try {
        const pChallengeId = req.body.challengeId;
        const pChallengeFilter = req.body.filter.filterValue;
        const pChallengeOptionR = req.body.filter.optionR;
        const pChallengeOptionArg = req.body.filter.optionArg;
        const pChallengeArgName = req.body.filter.argName;
        const pChallengeArgValue = req.body.filter.argValue;
        const pUid = req.body.uid;

        if (
            pChallengeId === undefined ||
            pChallengeFilter === undefined ||
            pUid === undefined ||
            pChallengeOptionR === undefined ||
            pChallengeOptionArg === undefined ||
            pChallengeArgName === undefined ||
            pChallengeArgValue === undefined
        ) {
            return res.status(400).send({ message: "missing or invalid challenge input parameter" });
        }

        const challenge = challenges.find((e) => e.challengeId === pChallengeId);

        if (challenge === undefined) {
            return res.status(400).send({ message: "invalid challenge id" });
        }

        const execArguments = ["-c"];
        pChallengeOptionR === true ? execArguments.push("-r") : null;
        pChallengeOptionArg === true
            ? execArguments.push("--arg") && execArguments.push(pChallengeArgName) && execArguments.push(pChallengeArgValue)
            : null;
        execArguments.push(pChallengeFilter);

        const responseUserSupplied = execFileSync("jq", execArguments, {
            input: JSON.stringify(challenge.challengeJson),
            timeout: 5000,
            maxBuffer: 1024 * 1024,
        }).toString();

        const userIsCorrect = challenge.challengeCorrectResponse === responseUserSupplied ? true : false;

        const returnMessage = {
            userIsCorrect: userIsCorrect,
            userResponse: responseUserSupplied,
            exitStatus: 0,
            errorMessage: null,
        };

        res.send(returnMessage);

        insertTelemetry("validate", pUid, pChallengeId, userIsCorrect, pChallengeFilter);
    } catch (error) {
        const returnMessage = {
            userIsCorrect: false,
            userResponse: null,
            exitStatus: error.status,
            errorMessage: error.stderr.toString(),
        };

        res.status(200).send(returnMessage);

        const pChallengeId = req.body.challengeId;
        const pChallengeFilter = req.body.filter;
        const pUid = req.body.uid;

        try {
            insertTelemetry("validate", pUid, pChallengeId, false, pChallengeFilter);
        } catch (e) {
            console.log(e.message);
        }
    }
});

// handle non-matching request
app.use((req, res) => {
    res.status(404).send({ message: "route not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: "an unexpected error occurred" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
